import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { delay, firstValueFrom, map, Observable, of, pipe } from 'rxjs';
import { AnimaticSceneModel } from '../models/animatics-scene.model';
import { ScreenplayState } from './screenplay.state';
import { HttpClient } from '@angular/common/http';
import { ProjectModel } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class AnimaticsState {
    private readonly projectState = inject(ProjectState);
    private readonly http = inject(HttpClient);

    private _animatics = signal<Array<AnimaticSceneModel>>([]);

    readonly animatics = this._animatics.asReadonly();

    async getProjectAnimatics(): Promise<Array<AnimaticSceneModel>> {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            const animatics = await firstValueFrom(this.http.get<Array<AnimaticSceneModel>>('/mock-data/projects.json'));
            this._animatics.set(animatics);
            return animatics;
        } catch (error) {
            throw new Error('Error fetching animatics')
        }
    }
    
    async generateProjectAnimatics(): Promise<Array<AnimaticSceneModel>> {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            const animatics = await firstValueFrom(this.http.get<Array<AnimaticSceneModel>>('/mock-data/projects.json'));
            this._animatics.set(animatics);
            return animatics;
        } catch (error) {
            throw new Error('Error generating animatics')
        }
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
    }
    
}