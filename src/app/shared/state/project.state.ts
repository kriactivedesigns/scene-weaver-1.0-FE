import { computed, inject, Injectable, signal } from "@angular/core";
import { ProjectMetadata } from "../models/project-metadata.model";
import { HttpClient } from "@angular/common/http";
import { Project } from "../models/project.model";
import { StorageKeys } from "../enums/storagekeys.enum";
import { Observable, pipe } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ProjectState {

    // Dependency Injections
    private http = inject(HttpClient);

    // Private states
    private _projects = signal<ProjectMetadata[]>([]);
    private _openedProject = signal<Project | null>(null);
    
    // Public readonly access
    readonly projects = this._projects.asReadonly();
    readonly openedProject = this._openedProject.asReadonly();
    
    // Computed selectors
    readonly openedProjectId = computed(() => this._openedProject()?.id);
    readonly currentProject = computed(() => this.projects().find(project => project.id === this._openedProject()?.id));
    readonly hasProjects = computed(() => this.projects().length > 0);

    constructor() {
        this.fetchProjects(); 
    }

    // Projects Management
    addProject(project: Omit<ProjectMetadata, 'id' | 'createdAt' | 'updatedAt'>): ProjectMetadata {
        const newProject: ProjectMetadata = {
            ...project,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this._projects.update(projects => [...projects, newProject]);
        return newProject;
    }

    updateProject(id: string, updates: Partial<ProjectMetadata>): void {
        this._projects.update(projects =>
        projects.map(p => p.id === id 
            ? { ...p, ...updates, updatedAt: new Date() }
            : p
        )
        );

        // Update current project if it's the one being updated
        if (this.currentProject()?.id === id) {
            this._openedProject.update(current => 
                current ? { ...current, ...updates, updatedAt: new Date() } : current
            );
        }
    }

    deleteProject(id: string): void {
        this._projects.update(projects => projects.filter(p => p.id !== id));
    }
    
    async openProject(projectMetadata: ProjectMetadata) {
        try {
            this.fetchProjectById(projectMetadata.id).subscribe(
                pipe((project: Project) => {
                    console.log(project);
                    this._openedProject.set(project);
                    this.setLocalPersistentProjectState(projectMetadata);
                })
            );
        } catch (error) {
            
        }
    }

    private setLocalPersistentProjectState(projectMetadata: ProjectMetadata) {
        localStorage.setItem(StorageKeys.OpenedProject,JSON.stringify(projectMetadata));
    }

    closeProject() {
        this._openedProject.set(null);
        localStorage.removeItem(StorageKeys.OpenedProject);
    }
    
    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    
    fetchProjects(): void {
        this.http.get<Array<ProjectMetadata>>('/mock-data/projects.json').subscribe({
            next: (projects) => {
                this._projects.set(projects);
            },
            error: (error) => {
                console.error('Error fetching projects:', error);
            }
        });
    }

    private fetchProjectById(projectId: string): Observable<Project> {
        return this.http.get<Project>('/mock-data/project.json');
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
    
}