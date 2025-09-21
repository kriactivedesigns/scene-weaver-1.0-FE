import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { delay, map, Observable, of, pipe } from 'rxjs';
import { AnimaticSceneModel } from '../models/animatics-scene.model';
import { ScreenplayState } from './screenplay.state';
import { HttpClient } from '@angular/common/http';
import { ProjectModel } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class AnimaticsState {
    private readonly projectState = inject(ProjectState);
    private readonly screenplayState = inject(ScreenplayState);
    private readonly http = inject(HttpClient);

    private _animatics = signal<Array<AnimaticSceneModel>>([]);

    readonly animatics = this._animatics.asReadonly();

    constructor() {
        effect(() => {
            // const pid = this.projectState.openedProject()?.id;
            // if (pid) {
            //     this.getScreenplayScenesByProjectId(pid).subscribe(
            //         pipe((animatics: Array<AnimaticSceneModel>) => {
            //             this._animatics.set(animatics);
            //         })
            //     );
            // }
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
    }

    private getScreenplayScenesByProjectId(pid: string): Observable<Array<AnimaticSceneModel>> {
        return this.http.get<Array<ProjectModel>>('/mock-data/projects.json').pipe(
            map((projects: any[]) => projects.find(p => p.id === pid).animatics)
        )
    }
    
}