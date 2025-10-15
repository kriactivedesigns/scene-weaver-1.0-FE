import { inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { delay, firstValueFrom, of, Subscription } from 'rxjs';
import { StoryboardImageModel } from '../models/storyboard-image.model';
import { HttpClient } from '@angular/common/http';
import { ScreenplayState } from './screenplay.state';
import { StoryboardWebSocketService } from '../services/storyboard-websocket.service';
import { environment } from '../../../environments/environment';
import { ScreenplaySceneModel } from '../models/screenplay-scene.model';

@Injectable({ providedIn: 'root' })
export class StoryboardState {

    private readonly projectState = inject(ProjectState);
    private readonly http = inject(HttpClient);
    private readonly screenplayState = inject(ScreenplayState);
    private readonly websocketService = inject(StoryboardWebSocketService);

    private readonly _storyboards = signal<Array<StoryboardImageModel>>([]);
    private readonly _lastGeneratedImageSceneId = signal<string | null>(null);
    private readonly _status = signal<GenerationStatus>('idle');
    private readonly _progress = signal<string>('0/0');

    private currentJobId: string | null = null;
    private wsSubscription: Subscription | null = null;

    readonly storyboards = this._storyboards.asReadonly();
    readonly lastGeneratedImageSceneId = this._lastGeneratedImageSceneId.asReadonly();
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
        
        
        const placeholders = scenes.map(scene => this.createPlaceholder(pid!, scene));
        this._storyboards.set(placeholders);
        
        const sceneIds = scenes.map(s => s.id);
        const payload = { scene_ids: sceneIds };
        
        this._status.set('starting');
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

    getStoryboardImageBySceneID(sceneId: string): StoryboardImageModel | undefined {
        return this._storyboards().find(image => image.sceneId === sceneId)
    }

    private listenForUpdates(jobId: string): void {
        this.wsSubscription = this.websocketService.connect(jobId).subscribe({
            next: (update) => {
                console.log("Received WS update:", update);
                if (update.event === 'GENERATION_IN_PROGRESS') {
                    this._status.set('in-progress');
                } else if (update.event === 'IMAGE_GENERATED' && update.storyboard) {
                    this._progress.set(update.progress!);
                    this._storyboards.update(currentBoards => 
                        currentBoards.map(board => 
                        board.sceneId === update.storyboard!.sceneId ? update.storyboard! : board
                    ));
                    this._lastGeneratedImageSceneId.set(update.storyboard!.sceneId);
                } else if (update.event === 'JOB_COMPLETED') {
                    this._status.set('completed');
                    this._lastGeneratedImageSceneId.set(null);
                    this.cleanup();
                } else if (update.event === 'JOB_CANCELLED') {
                    this._status.set('cancelled');
                    this._lastGeneratedImageSceneId.set(null);
                    this.cleanup();
                } else if (update.event === 'ERROR') {
                    this._status.set('error');
                    this._lastGeneratedImageSceneId.set(null);
                    this.cleanup();
                }
            },
            error: (err) => {
                console.error("WebSocket error occurred", err);
            },
            complete: () => {
                console.log("WebSocket connection closed");
                if (this.status() === 'in-progress') this._status.set('completed');
            }
        });
    }

    async cancelGeneration(): Promise<void> {
        if (!this.currentJobId) return;
            this._status.set('cancelling');
            const url = `${environment.apiBaseUrl}/storyboards/cancel/${this.currentJobId}`;
            const response = await firstValueFrom(this.http.post(url, {}));
            console.log("Cancellation response:", response);
        return
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