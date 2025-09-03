import { computed, inject, Injectable, signal } from "@angular/core";
import { Project } from "../models/project.model";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ProjectState {

    private _projects = signal<Project[]>([]);
    private _currentProjectId = signal<string | null>(null);
    private _currentProject = signal<Project | null>(null);
    
    // Public readonly access
    readonly projects = this._projects.asReadonly();
    readonly currentProjectId = this._currentProjectId.asReadonly();

    // Computed selectors
    readonly hasProjects = computed(() => this.projects().length > 0);
    readonly currentProject = computed(() => this.projects().find(p => p.id === this.currentProjectId()));

    private http = inject(HttpClient);

    // Projects Management
    addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
        const newProject: Project = {
        ...project,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
        };
        
        this._projects.update(projects => [...projects, newProject]);
        return newProject;
    }

    updateProject(id: string, updates: Partial<Project>): void {
        this._projects.update(projects =>
        projects.map(p => p.id === id 
            ? { ...p, ...updates, updatedAt: new Date() }
            : p
        )
        );

        // Update current project if it's the one being updated
        if (this.currentProject()?.id === id) {
        this._currentProject.update(current => 
            current ? { ...current, ...updates, updatedAt: new Date() } : current
        );
        }
    }

    deleteProject(id: string): void {
        this._projects.update(projects => projects.filter(p => p.id !== id));        
        if (this.currentProject()?.id === id) {
        this._currentProject.set(null);
        }
    }

    setCurrentProjectId(projectId: string): void {
        this._currentProjectId.set(projectId);
    }
    
    fetchProjects(): void {
        this.http.get<Array<Project>>('/mock-data/projects.json').subscribe({
            next: (projects) => {
                console.log(projects);
                this._projects.set(projects);
            },
            error: (error) => {
                console.error('Error fetching projects:', error);
            }
        });
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

}