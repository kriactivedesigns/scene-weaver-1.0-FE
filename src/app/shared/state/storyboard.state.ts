import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { ProjectModel } from '../models/project.model';
import { delay, of } from 'rxjs';
import { StoryboardImageModel } from '../models/storyboard-image.model';

@Injectable({ providedIn: 'root' })
export class ScreenplayState {
    private readonly projectState = inject(ProjectState);

    private _storyboard = signal<Array<StoryboardImageModel>>([]);

    readonly storyboard = this._storyboard.asReadonly();

    constructor() {
        effect(() => {
            const storyboard = this.projectState.openedProject()?.storyboard;
            this._storyboard.set(storyboard ? storyboard : []);
        })
    }

    addOrUpdateScreenplay(data: StoryboardImageModel) {
        const currentProject = this.projectState.openedProject();
        const screenPlay = this.storyboard();

        if (!currentProject)
            return

        if(screenPlay.length) {
            // Update existing scene in screenplay arra
            data = {
                ...data,
                updatedAt: new Date(),
            }
            this._storyboard.update((storyboard) => storyboard.map(image => image.id == data.id ? { ...image, ...data } : image));
            this.updateProject(currentProject.id, { storyboard: this._storyboard() })
        }

        return of(true).pipe(delay(3000));
        
    }

    private updateProject(pid: string, updates: Partial<ProjectModel>): void {
        this.projectState.updateOpenedProject(pid, updates);
    }
    
}