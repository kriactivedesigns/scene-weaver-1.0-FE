import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { StoryModel } from '../models/story.model';
import { CommonService } from '../services/common.service';
import { ProjectModel } from '../models/project.model';
import { delay, firstValueFrom, map, Observable, of, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StoryState {
    private readonly projectState = inject(ProjectState);
    private readonly commonService = inject(CommonService);
    private readonly http = inject(HttpClient);

    private _story = signal<StoryModel | null>(null);

    readonly story = this._story.asReadonly();

    async generateStory(): Promise<StoryModel> {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            
            const story = await firstValueFrom(this.http.post<StoryModel>(`${environment.apiBaseUrl}/projects/${pid}/generate-story`, null))
            this._story.update(() => story);
            return story;
        } catch (error) {
            throw new Error("Failed to generate a new story")
        }
    }

    async updateStory(updatedStory: StoryModel) {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            
            const story = await firstValueFrom(this.http.put<StoryModel>(`${environment.apiBaseUrl}/stories/${updatedStory.id}`, updatedStory))
            this._story.update(() => story);
            return story;
        } catch (error) {
            throw new Error("Failed to generate a new story")
        }
    }

    async getProjectStory(): Promise<StoryModel> {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            
            const story = await firstValueFrom(this.http.get<StoryModel>(`${environment.apiBaseUrl}/projects/${pid}/story`))
            this._story.update(() => story);
            return story;
        } catch (error) {
            throw new Error("Failed to generate a new story")
        }
    }
    
}