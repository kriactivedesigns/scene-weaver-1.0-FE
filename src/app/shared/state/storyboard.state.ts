import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { delay, firstValueFrom, map, Observable, of, pipe } from 'rxjs';
import { StoryboardImageModel } from '../models/storyboard-image.model';
import { ProjectModel } from '../models/project.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class StoryboardState {

    private readonly projectState = inject(ProjectState);
    private readonly http = inject(HttpClient);

    private _storyboard = signal<Array<StoryboardImageModel>>([]);

    readonly storyboard = this._storyboard.asReadonly();

    async getProjectStoryboard(): Promise<Array<StoryboardImageModel>> {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            const storyboard = await firstValueFrom(this.http.get<Array<StoryboardImageModel>>('/mock-data/projects.json'));
            this._storyboard.set(storyboard);
            return storyboard;
        } catch (error) {
            throw new Error('Error fetching storyboard')
        }
    } 
    
    async generateStoryboard(): Promise<Array<StoryboardImageModel>> {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            const storyboard = await firstValueFrom(this.http.get<Array<StoryboardImageModel>>('/mock-data/projects.json'));
            this._storyboard.set(storyboard);
            return storyboard;
        } catch (error) {
            throw new Error('Error fetching storyboard')
        }
    } 

    updateStoryboard(data: StoryboardImageModel) {
        const currentProject = this.projectState.openedProject();
        const storyboard = this.storyboard();

        if (!currentProject)
            return

        if(storyboard.length) {
            // Update existing scene in screenplay arra
            data = {
                ...data,
                updatedAt: new Date(),
            }
            this._storyboard.update((storyboard) => storyboard.map(image => image.id == data.id ? { ...image, ...data } : image));
            this.updateProject()
        }

        return of(true).pipe(delay(3000));
        
    }

    updateImageWithPrompt(prompt: string, imageId: string): void {
        const storyboard = [...this._storyboard()];
        if (storyboard.length) {
            storyboard.forEach((image: any) => {
                if (image.id === imageId) {
                    image.imagePath = 'mock-data/scenes/scene02.png'
                }
            })
        }
        this._storyboard.set(storyboard);
        this.updateProject();
    }

    getStoryboardImageBySceneID(sceneId: string): StoryboardImageModel | undefined {
        return this._storyboard().find(image => image.sceneId === sceneId)
    }

    private updateProject(): void {
        // const currentProject = this.projectState.openedProject();
        // if (!currentProject)
        //     return
        // this.projectState.updateOpenedProject(currentProject.id, { storyboard: this._storyboard() });
    }
    
}