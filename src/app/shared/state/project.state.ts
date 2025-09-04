import { computed, inject, Injectable, signal } from "@angular/core";
import { ProjectMetadata } from "../models/project-metadata.model";
import { HttpClient } from "@angular/common/http";
import { Project } from "../models/project.model";
import { Pages } from "../enums/pages";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class ProjectState {

    private _projects = signal<ProjectMetadata[]>([]);
    // private _currentProjectId = signal<string | null>(null);
    // private _currentProject = signal<ProjectMetadata | null>(null);
    private _openedProject = signal<Project | null>(null);
    
    // Public readonly access
    readonly projects = this._projects.asReadonly();
    // readonly currentProjectId = this._currentProjectId.asReadonly();
    readonly openedProject = this._openedProject.asReadonly();

    // Computed selectors
    readonly hasProjects = computed(() => this.projects().length > 0);
    readonly currentProjectId = computed(() => this.openedProject()?.id);
    readonly currentProject = computed(() => this.projects().find(p => p.id === this.openedProject()?.id));

    private http = inject(HttpClient);
    private router = inject(Router);

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
    
    openProject(projectMetadata: ProjectMetadata | null) {
        this._openedProject.set(projectMetadata);
    }

    closeProject() {
        this._openedProject.set(null);
        this.router.navigateByUrl(Pages.Dashboard);
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

}