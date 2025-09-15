import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { ProjectModel } from '../models/project.model';
import { delay, of } from 'rxjs';
import { ScreenplaySceneModel } from '../models/screenplay-scene.model';

@Injectable({ providedIn: 'root' })
export class ScreenplayState {
    private readonly projectState = inject(ProjectState);

    private _screenplay = signal<Array<ScreenplaySceneModel>>([]);

    readonly screenplay = this._screenplay.asReadonly();

    constructor() {
        effect(() => {
            const screenplay = this.projectState.openedProject()?.screenplay;
            this._screenplay.set(screenplay ? screenplay : []);
        })
    }

    addOrUpdateScreenplay(data: ScreenplaySceneModel) {
        const currentProject = this.projectState.openedProject();
        const screenPlay = this._screenplay();

        if (!currentProject)
            return

        if(screenPlay.length) {
            // Update existing scene in screenplay arra
            data = {
                ...data,
                updatedAt: new Date(),
            }
            this._screenplay.update((screenPlay) => screenPlay.map(scene => scene.id == data.id ? { ...scene, ...data } : scene));
            this.updateProject(currentProject.id, { screenplay: this._screenplay() })
        }

        return of(true).pipe(delay(3000));
        
    }

    private updateProject(pid: string, updates: Partial<ProjectModel>): void {
        this.projectState.updateOpenedProject(pid, updates);
    }
    
}