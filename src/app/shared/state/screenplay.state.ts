import { effect, inject, Injectable, signal } from '@angular/core';
import { ProjectState } from './project.state';
import { ProjectModel } from '../models/project.model';
import { delay, map, of } from 'rxjs';
import { ScreenplaySceneModel } from '../models/screenplay-scene.model';
import { CommonService } from '../services/common.service';

@Injectable({ providedIn: 'root' })
export class ScreenplayState {

    private readonly projectState = inject(ProjectState);
    private readonly commonService = inject(CommonService);

    private _screenplay = signal<Array<ScreenplaySceneModel>>([]);

    readonly screenplay = this._screenplay.asReadonly();

    constructor() {
        effect(() => {
            const screenplay = this.projectState.openedProject()?.screenplay;
            this._screenplay.set(screenplay ? screenplay : []);
        })
    }

    updateScreenplay(data: ScreenplaySceneModel) {
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
            this.updateProject()
        }
        return of(true).pipe(delay(3000));
    }

    addNewScene() {
        const currentProject = this.projectState.openedProject();
        if (!currentProject)
            return
        const newScene: ScreenplaySceneModel = {
            id: this.commonService.generateId(),
            projectId: currentProject.id,
            sceneNumber: this._screenplay().length + 1,
            content: 'Add new scene..',
            duration: 120,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        this._screenplay.update((scenes) => [...scenes, newScene])
        this.updateProject();
    }

    deleteScene(scene: ScreenplaySceneModel): void {
        this._screenplay.update((scenes) => scenes.filter(s => s.id != scene.id));
        this._screenplay.update((scenes) => scenes.filter((s, index) => s.sceneNumber = index + 1));
        this.updateProject();
    }

    updateSceneOrder(newlyOrderedScenes: Array<ScreenplaySceneModel>): void {
        const currentProject = this.projectState.openedProject();
        if (!currentProject)
            return
        newlyOrderedScenes.forEach(s => s.updatedAt = new Date());
        this._screenplay.set(newlyOrderedScenes);
        this.updateProject()
    }

    private updateProject(): void {
        const currentProject = this.projectState.openedProject();
        if (!currentProject)
            return
        this.projectState.updateOpenedProject(currentProject.id, { screenplay: this._screenplay() });
    }
    
}