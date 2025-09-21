import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { StoryModel } from '../models/story.model';
import { CommonService } from '../services/common.service';
import { ProjectModel } from '../models/project.model';
import { delay, map, Observable, of, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class StoryState {
    private readonly projectState = inject(ProjectState);
    private readonly commonService = inject(CommonService);
    private readonly http = inject(HttpClient);

    private _story = signal<StoryModel | null>(null);

    readonly story = this._story.asReadonly();

    constructor() {
        // effect(() => {
        //     const pid = this.projectState.openedProject()?.id;
        //     if (pid) {
        //         this.getStoryByProjectId(pid).subscribe(
        //             pipe((story: StoryModel) => {
        //                 this._story.set(story);
        //             })
        //         );
        //     }
        // })
    }

    addOrUpdateStory(data: Omit<StoryModel, 'id' | 'createdAt' | 'updatedAt' | 'projectId' | 'version' | 'title'>) {
        const currentProject = this.projectState.openedProject();
        const currentStory = this._story();
        let story: StoryModel;

        if (!currentProject)
            return

        if(currentStory) {
            // Update existing story
            story = {
                ...currentStory,
                content: data.content,
                version: currentStory.version + 1,
                updatedAt: new Date()
            }
        } else {
            // add new story
            story = {
                ...data,
                title: currentProject.projectName,
                id: this.commonService.generateId(),
                projectId: currentProject.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1
            }
        }

        this._story.update(() => story);
        // this.updateProject(currentProject.id, { story: story })
        return of(true).pipe(delay(3000));
        
    }

    private updateProject(pid: string, updates: Partial<ProjectModel>): void {
        // this.projectState.updateOpenedProject(pid, updates);
    }

    private getStoryByProjectId(pid: string): Observable<StoryModel> {
        return this.http.get<Array<ProjectModel>>('/mock-data/projects.json').pipe(
            map((projects: any[]) => projects.find(p => p.id === pid).story)
        )
    }
    
}