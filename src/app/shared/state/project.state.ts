import { computed, inject, Injectable, signal } from "@angular/core";
import { ProjectMetadataModel } from "../models/project-metadata.model";
import { HttpClient } from "@angular/common/http";
import { ProjectModel } from "../models/project.model";
import { StorageKeys } from "../enums/storagekeys.enum";
import { map, Observable, pipe } from "rxjs";
import { CommonService } from "../services/common.service";

@Injectable({ providedIn: 'root' })
export class ProjectState {

    // Dependency Injections
    private http = inject(HttpClient);
    private commonService = inject(CommonService);

    // Private states
    private _projects = signal<ProjectMetadataModel[]>([]);
    private _openedProject = signal<ProjectModel | null>(null);
    
    // Public readonly access
    readonly projects = this._projects.asReadonly();
    readonly openedProject = this._openedProject.asReadonly();
    
    // Computed selectors
    readonly openedProjectId = computed(() => this._openedProject()?.id);
    readonly hasProjects = computed(() => this.projects().length > 0);

    constructor() {
        this.fetchProjects(); 
    }

    // Projects Management
    addProject(project: Omit<ProjectMetadataModel, 'id' | 'createdAt' | 'updatedAt'>): ProjectMetadataModel {
        const newProject: ProjectMetadataModel = {
            ...project,
            id: this.commonService.generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this._projects.update(projects => [...projects, newProject]);
        return newProject;
    }

    updateProject(id: string, updates: Partial<ProjectMetadataModel>): void {
        this._projects.update(projects =>
        projects.map(p => p.id === id 
            ? { ...p, ...updates, updatedAt: new Date() }
            : p
        )
        );

        // Update current project if it's the one being updated
        if (this.openedProject()?.id === id) {
            this._openedProject.update(current => 
                current ? { ...current, ...updates, updatedAt: new Date() } : current
            );
        }
    }

    deleteProject(id: string): void {
        this._projects.update(projects => projects.filter(p => p.id !== id));
    }
    
    async openProject(projectMetadata: ProjectMetadataModel) {
        try {
            this.fetchProjectById(projectMetadata.id).subscribe(
                pipe((project: ProjectModel | undefined) => {
                    if (project) {
                        this._openedProject.set(project);
                        this.setLocalPersistentProjectState(projectMetadata);
                    }
                })
            );
        } catch (error) {
            
        }
    }

    private setLocalPersistentProjectState(projectMetadata: ProjectMetadataModel) {
        localStorage.setItem(StorageKeys.OpenedProject,JSON.stringify(projectMetadata));
    }

    closeProject() {
        this._openedProject.set(null);
        localStorage.removeItem(StorageKeys.OpenedProject);
    }
    
    fetchProjects(): void {
        this.http.get<Array<ProjectMetadataModel>>('/mock-data/projects_metadata.json').subscribe({
            next: (projects) => {
                this._projects.set(projects);
            },
            error: (error) => {
                console.error('Error fetching projects:', error);
            }
        });
    }

    private fetchProjectById(projectId: string): Observable<ProjectModel | undefined> {
        return this.http.get<Array<ProjectModel>>('/mock-data/projects.json').pipe(
            map(projects => projects.find(project => project.id === projectId))
        );
    }

    isProjectOpen(): boolean {
        if (this.openedProject())
            return true;
        const storedProject = localStorage.getItem(StorageKeys.OpenedProject);
        if (storedProject) {
            const projectMetadata = JSON.parse(storedProject);
            this.openProject(projectMetadata);
            return true;
        }
        return false;
    }

    updateOpenedProject(projectId: string, updates: Partial<ProjectModel>): void {
        this._projects.update(projects =>
            projects.map(p => p.id === projectId 
                ? { ...p, ...updates, updatedAt: new Date() }
                : p
            )
        );

        // Safely update the opened project
       this._openedProject.update(currentProject => {
         if (!currentProject || currentProject.id !== projectId) {
           return currentProject;
         }

         // 2. Safe Update: Now that TypeScript knows currentProject is not null,
         return { ...currentProject, ...updates, updatedAt: new Date() };
       });
    }
    
}