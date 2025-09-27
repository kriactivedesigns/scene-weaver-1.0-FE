import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { delay, firstValueFrom, map, Observable, of, pipe, Subscription } from 'rxjs';
import { StoryboardImageModel } from '../models/storyboard-image.model';
import { ProjectModel } from '../models/project.model';
import { HttpClient } from '@angular/common/http';
import { ScreenplayState } from './screenplay.state';
import { StoryboardWebSocketService } from '../services/storyboard-websocket.service';
import { environment } from '../../../environments/environment';
import { ScreenplaySceneModel } from '../models/screenplay-scene.model';

type GenerationStatus = 'idle' | 'starting' | 'in-progress' | 'completed' | 'cancelled' | 'error';

@Injectable({ providedIn: 'root' })
export class StoryboardState {

    private readonly projectState = inject(ProjectState);
    private readonly http = inject(HttpClient);
    private readonly screenplayState = inject(ScreenplayState);
    private readonly websocketService = inject(StoryboardWebSocketService);

    private readonly _storyboards = signal<Array<StoryboardImageModel>>([]);
    private readonly _status = signal<GenerationStatus>('idle');
    private readonly _progress = signal<string>('0/0');

    private currentJobId: string | null = null;
    private wsSubscription: Subscription | null = null;

    readonly storyboards = this._storyboards.asReadonly();
    readonly status = this._status.asReadonly();
    readonly progress = this._progress.asReadonly();

    async getProjectStoryboard(): Promise<Array<StoryboardImageModel>> {
        if (this.status() === 'in-progress' || this.status() === 'starting') 
            return this.storyboards();
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            const existingBoards = await firstValueFrom(this.http.get<Array<StoryboardImageModel>>(`${environment.apiBaseUrl}/projects/${pid}/storyboards`));
            this._storyboards.set(existingBoards);
            return existingBoards;
        } catch (error) {
            this._storyboards.set([]);
            throw new Error('Error fetching storyboard')
        }
    } 
    
    async generateStoryboards(): Promise<void> {
        if (this.status() === 'in-progress' || this.status() === 'starting') return
        const pid = this.projectState.openedProjectId();
        const scenes = this.screenplayState.screenplayScenes();
        if (!pid || scenes.length == 0)
            throw new Error("Cannot generate storyboards: No project or scenes available.")
        
        this._status.set('starting');
        const placeholders = scenes.map(scene => this.createPlaceholder(pid!, scene));
        this._storyboards.set(placeholders);
        
        const sceneIds = scenes.map(s => s.id);
        const payload = { scene_ids: sceneIds };
        
        const url = `${environment.apiBaseUrl}/projects/${pid}/storyboards/generate`;
        try {
            const res = await firstValueFrom(this.http.post<{ job_id: string}>(url, payload));
            this.currentJobId = res.job_id;
            this.listenForUpdates(this.currentJobId);
        } catch (error) {
            this._status.set('error');
            throw new Error('Failed to start storyboard generation')
        }
    }

    updateStoryboard(data: StoryboardImageModel) {
        const currentProject = this.projectState.openedProject();
        const storyboard = this.storyboards();

        if (!currentProject)
            return

        if(storyboard.length) {
            // Update existing scene in screenplay arra
            data = {
                ...data,
                updatedAt: new Date(),
            }
            this._storyboards.update((storyboard) => storyboard.map(image => image.id == data.id ? { ...image, ...data } : image));
            this.updateProject()
        }

        return of(true).pipe(delay(3000));
        
    }

    updateImageWithPrompt(prompt: string, imageId: string): void {
        const storyboard = [...this._storyboards()];
        if (storyboard.length) {
            storyboard.forEach((image: any) => {
                if (image.id === imageId) {
                    image.imagePath = 'mock-data/scenes/scene02.png'
                }
            })
        }
        this._storyboards.set(storyboard);
        this.updateProject();
    }

    getStoryboardImageBySceneID(sceneId: string): StoryboardImageModel | undefined {
        return this._storyboards().find(image => image.sceneId === sceneId)
    }

    private updateProject(): void {
        // const currentProject = this.projectState.openedProject();
        // if (!currentProject)
        //     return
        // this.projectState.updateOpenedProject(currentProject.id, { storyboard: this._storyboard() });
    }

    private listenForUpdates(jobId: string): void {
        this._status.set('in-progress');
    
        this.wsSubscription = this.websocketService.connect(jobId).subscribe({
            next: (update) => {
                if (update.event === 'IMAGE_GENERATED' && update.storyboard) {
                    this._progress.set(update.progress!);
                    this._storyboards.update(currentBoards => 
                        currentBoards.map(board => 
                        board.sceneId === update.storyboard!.sceneId ? update.storyboard! : board
                    ));
                } else if (update.event === 'JOB_COMPLETED') {
                    this._status.set('completed');
                    this.cleanup();
                } else if (update.event === 'JOB_CANCELLED') {
                    this._status.set('cancelled');
                    this.cleanup();
                }
            },
            error: () => this._status.set('error'),
            complete: () => {
                if (this.status() === 'in-progress') this._status.set('completed');
            }
        });
  }

  cancelGeneration(): void {
    if (!this.currentJobId) return;
    const url = `${environment.apiBaseUrl}/storyboards/cancel/${this.currentJobId}`;
    this.http.post(url, {}).subscribe();
  }

  private createPlaceholder(projectId: string, scene: ScreenplaySceneModel): StoryboardImageModel {
    return {
      id: scene.id,
      projectId,
      sceneId: scene.id,
      aspectRatio: "16:9",
      prompt: "generating",
      imagePath: "generating", 
      version: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private cleanup(): void {
    if (this.wsSubscription) this.wsSubscription.unsubscribe();
    this.websocketService.disconnect();
    this.currentJobId = null;
  }
    
}