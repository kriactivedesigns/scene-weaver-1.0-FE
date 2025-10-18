import { inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { delay, firstValueFrom, of, Subscription } from 'rxjs';
import { AnimaticSceneModel as AnimaticsSceneModel } from '../models/animatics-scene.model';
import { ScreenplayState } from './screenplay.state';
import { HttpClient } from '@angular/common/http';
import { AnimaticsWebSocketService } from '../services/animatics-websocket.service';
import { environment } from '../../../environments/environment';
import { ScreenplaySceneModel } from '../models/screenplay-scene.model';

@Injectable({ providedIn: 'root' })
export class AnimaticsState {
    private readonly projectState = inject(ProjectState);
    private readonly http = inject(HttpClient);
    private readonly screenplayState = inject(ScreenplayState);
    private readonly websocketService = inject(AnimaticsWebSocketService);

    private readonly _animatics = signal<Array<AnimaticsSceneModel>>([]);
    private readonly _status = signal<GenerationStatus>('idle');
    private readonly _progress = signal<string>('0/0');

    private currentJobId: string | null = null;
    private wsSubscription: Subscription | null = null;

    readonly animatics = this._animatics.asReadonly();
    readonly status = this._status.asReadonly();
    readonly progress = this._progress.asReadonly();

    async getProjectAnimatics(): Promise<Array<AnimaticsSceneModel>> {
        if (this.status() === 'in-progress' || this.status() === 'starting') 
            return this.animatics();
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            const existingBoards = await firstValueFrom(this.http.get<Array<AnimaticsSceneModel>>(`${environment.apiBaseUrl}/projects/${pid}/animatics`));
            this._animatics.set(existingBoards);
            return existingBoards;
        } catch (error) {
            this._animatics.set([]);
            throw new Error('Error fetching animatics')
        }
    }
    
    async generateProjectAnimatics(): Promise<void> {
        if (this.status() === 'in-progress' || this.status() === 'starting') return
        
        const pid = this.projectState.openedProjectId();
        const scenes = this.screenplayState.screenplayScenes();
        if (!pid || scenes.length == 0)
            throw new Error("Cannot generate storyboards: No project or scenes available.")
        
        this._status.set('starting');
        // const placeholders = scenes.map(scene => this.createPlaceholder(pid!, scene));
        const placeholders = [scenes[0]].map(scene => this.createPlaceholder(pid!, scene));
        this._animatics.set(placeholders);
        
        // const sceneIds = scenes.map(s => s.id);
        const sceneIds = [scenes[0]].map(s => s.id);
        const payload = { scene_ids: sceneIds };

        const url = `${environment.apiBaseUrl}/projects/${pid}/animatics/generate`;
        try {
            const res = await firstValueFrom(this.http.post<{ job_id: string}>(url, payload));
            this.currentJobId = res.job_id;
            this.listenForUpdates(this.currentJobId);
        } catch (error) {
            this._status.set('error');
            throw new Error('Failed to start storyboard generation')
        }
    }

    cancelGeneration(): void {
        if (!this.currentJobId) return;
        const url = `${environment.apiBaseUrl}/animatics/cancel/${this.currentJobId}`;
        this.http.post(url, {}).subscribe();
    }

    private createPlaceholder(projectId: string, scene: ScreenplaySceneModel): AnimaticsSceneModel {
        return {
          id: scene.id,
          projectId,
          sceneId: scene.id,
          duration: scene.duration,
          aspectRatio: "16:9",
          videoPath: "generating", 
          version: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
    }

    private listenForUpdates(jobId: string): void {
        this._status.set('in-progress');
    
        this.wsSubscription = this.websocketService.connect(jobId).subscribe({
            next: (update) => {
                if (update.event === 'IMAGE_GENERATED' && update.animatics) {
                    this._progress.set(update.progress!);
                    this._animatics.update(currentBoards => 
                        currentBoards.map(board => 
                        board.sceneId === update.animatics!.sceneId ? update.animatics! : board
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
    
    private cleanup(): void {
        if (this.wsSubscription) this.wsSubscription.unsubscribe();
        this.websocketService.disconnect();
        this.currentJobId = null;
    }

    updateAnimatic(data: AnimaticsSceneModel) {
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
            animatics.forEach((anim: AnimaticsSceneModel) => {
                if (anim.id === animId) {
                    anim.videoPath = 'mock-data/scenes/scene02.png'
                }
            })
        }
        this._animatics.set(animatics);
        this.updateProject();
    }

    getAnimaticsBySceneID(sceneId: string): AnimaticsSceneModel | undefined {
        return this._animatics().find(anim => anim.sceneId === sceneId)
    }

    private updateProject(): void {
        const currentProject = this.projectState.openedProject();
        if (!currentProject)
            return
    }

    clearAnimaticData(): void {
      this._animatics.set([]);
      this._status.set('idle');
      this._progress.set('0/0');
      this.cleanup();
    }
    
}