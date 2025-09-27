import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { ProjectModel } from '../models/project.model';
import { catchError, delay, firstValueFrom, forkJoin, from, map, Observable, of, pipe } from 'rxjs';
import { ScreenplaySceneModel } from '../models/screenplay-scene.model';
import { CommonService } from '../services/common.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ScreenplayState {

    private readonly projectState = inject(ProjectState);
    private readonly commonService = inject(CommonService);
    private readonly http = inject(HttpClient);

    private _screenplayScenes = signal<Array<ScreenplaySceneModel>>([]);

    readonly screenplayScenes = this._screenplayScenes.asReadonly();

    async getProjectScreenplay(): Promise<Array<ScreenplaySceneModel>> {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            
            const screenplayScenes = await firstValueFrom(this.http.get<Array<ScreenplaySceneModel>>(`${environment.apiBaseUrl}/projects/${pid}/screenplay`))
            this._screenplayScenes.update(() => screenplayScenes);
            return screenplayScenes;
        } catch (error) {
            throw new Error("Failed to generate a new story")
        }
    }

    async generateScreenplayScenes(): Promise<Array<ScreenplaySceneModel>> {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            
            const screenplayScenes = await firstValueFrom(this.http.post<Array<ScreenplaySceneModel>>(`${environment.apiBaseUrl}/projects/${pid}/generate-screenplay`, null))
            this._screenplayScenes.update(() => screenplayScenes);
            return screenplayScenes;
        } catch (error) {
            throw new Error("Failed to generate a new story")
        }
    }

    async updateScreenplayScene(scene: ScreenplaySceneModel): Promise<void> {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            
            const screenplayScene = await firstValueFrom(this.http.patch<ScreenplaySceneModel>(
                    `${environment.apiBaseUrl}/screenplayscenes/${scene.id}`,
                    scene
                ))
            this._screenplayScenes.update((currentScenes) => {
                currentScenes.forEach(scene => {
                    if(scene.id === screenplayScene.id)
                        scene = {...screenplayScene}
                })
                return currentScenes
            });
        } catch (error) {
            throw new Error("Failed to generate a new story")
        }
    }

    async addNewScene() {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            
            const screenplayScene = await firstValueFrom(this.http.post<ScreenplaySceneModel>(`${environment.apiBaseUrl}/projects/${pid}/screenplayscenes`,
                {
                    content: '',
                    duration: 60
                }
            ));
            this._screenplayScenes.update((currentScenes) => [...currentScenes, screenplayScene]);
        } catch (error) {
            throw new Error("Failed to generate a new story")
        }
    }

    async deleteScene(scene: ScreenplaySceneModel): Promise<void> {
        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")
            
            const screenplayScenes = await firstValueFrom(this.http.delete<Array<ScreenplaySceneModel>>(`${environment.apiBaseUrl}/screenplayscenes/${scene.id}`));
            this._screenplayScenes.set(screenplayScenes);
        } catch (error) {
            throw new Error("Failed to generate a new story")
        }
    }

    updateSceneOrder(updatedScenes: Array<ScreenplaySceneModel>, originalScenes: Array<ScreenplaySceneModel>): void {

        this._screenplayScenes.set(updatedScenes);

        try {
            let pid = this.projectState.openedProjectId();
            if (!pid)
                throw new Error("invalid project id")

            const updateRequests = updatedScenes.map(scene => {
                return this.http.patch(
                    `${environment.apiBaseUrl}/screenplayscenes/${scene.id}`,
                    { sceneNumber: scene.sceneNumber }
                ).pipe(
                    catchError(error => {
                        console.error(`Failed to update scene order for scene ${scene.id}:`, error)
                        return of(error)
                    })
                )
            })

            if (updateRequests.length > 0) {
                forkJoin(updateRequests).subscribe(results => {
                    const hasErrors = results.some((res: any) => res instanceof Error || (res && res.name === 'HttpErrorResponse'));
                    if (hasErrors) {
                        console.error("One or more scene updates failed. Rolling back UI state.");
                        // ROLLBACK: Revert the signal to the original order.
                        this._screenplayScenes.set(originalScenes);
                    } else {
                        console.log("Scene order successfully synced with the server.");
                        // On success, do nothing. The optimistic UI was already correct.
                    }
                })
            }
            
        } catch (error) {
            throw new Error("Failed to generate a new story")
        }
    }
    
    getSceneByID(sceneId: string): ScreenplaySceneModel | undefined {
        return this._screenplayScenes().find(scene => scene.id === sceneId)
    }

}