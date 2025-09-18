import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { delay, of } from 'rxjs';
import { AnimaticSceneModel } from '../models/animatics-scene.model';

@Injectable({ providedIn: 'root' })
export class AnimaticsState {
    private readonly projectState = inject(ProjectState);

    private _animatics = signal<Array<AnimaticSceneModel>>([]);

    readonly animatics = this._animatics.asReadonly();

    constructor() {
        effect(() => {
            const animatics = this.projectState.openedProject()?.animatics;
            this._animatics.set(animatics ? animatics : []);
        })
    }

    updateStoryboard(data: AnimaticSceneModel) {
        const currentProject = this.projectState.openedProject();
        const animatics = this.animatics();

        if (!currentProject)
            return

        if(animatics.length) {
            // Update existing scene in screenplay arra
            data = {
                ...data,
                updatedAt: new Date(),
            }
            this._animatics.update((animatics) => animatics.map(anim => anim.id == data.id ? { ...anim, ...data } : anim));
            this.updateProject()
        }

        return of(true).pipe(delay(3000));
        
    }

    updateImageWithPrompt(prompt: string, animId: string): void {
        const animatics = [...this._animatics()];
        if (animatics.length) {
            animatics.forEach((anim: AnimaticSceneModel) => {
                if (anim.id === animId) {
                    anim.videoPath = 'mock-data/scenes/scene02.png'
                }
            })
        }
        this._animatics.set(animatics);
        this.updateProject();
    }

    getAnimaticsBySceneID(sceneId: string): AnimaticSceneModel | undefined {
        return this._animatics().find(anim => anim.sceneId === sceneId)
    }

    private updateProject(): void {
        const currentProject = this.projectState.openedProject();
        if (!currentProject)
            return
        this.projectState.updateOpenedProject(currentProject.id, { animatics: this._animatics() });
    }
    
}