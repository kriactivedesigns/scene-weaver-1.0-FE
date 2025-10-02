import { computed, CSP_NONCE, inject, Injectable, signal } from "@angular/core";
import { ProjectMetadataModel } from "../models/project-metadata.model";
import { HttpClient } from "@angular/common/http";
import { ProjectModel } from "../models/project.model";
import { StorageKeys } from "../enums/storagekeys.enum";
import { firstValueFrom, lastValueFrom, map, Observable, pipe, tap } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ProjectState {

    // Dependency Injections
    private http = inject(HttpClient);

    // Private states
    private _projects = signal<ProjectModel[]>([]);
    private _openedProject = signal<ProjectModel | null>(null);
    
    // Public readonly access
    readonly projects = this._projects.asReadonly();
    readonly openedProject = this._openedProject.asReadonly();
    
    // Computed selectors
    readonly openedProjectId = computed(() => this._openedProject()?.id);
    readonly hasProjects = computed(() => this.projects().length > 0);

    // Projects Management
    addProject(project: ProjectMetadataModel): void {
        this.http.post<ProjectModel>(`${environment.apiBaseUrl}/projects/`, project)
        .subscribe({
            next: (newProject: ProjectModel) => {
                this._projects.update(projects => [...projects, newProject]);
            },
            error: (err) => {
                console.error('Error creating a project')
            }
        })
    }

    updateProject(id: string, updates: ProjectModel): void {
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
        this.http.delete<void>(`${environment.apiBaseUrl}/projects/${id}/`).subscribe({
            next: value => {
                this._projects.update(projects => projects.filter(p => p.id !== id));
            },
            error: err => {
                console.error(err)
            }
        })
    }
    
    openProject(projectId: string) {
        try {
            const project = this._projects().find(projects => projects.id === projectId);
            if (project) {
                this._openedProject.set(project);
                this.setLocalPersistentProjectState(project);
            } else {
                throw new Error("Error opening a project")
            }
        } catch (error) {
            throw error
        }
    }

    private setLocalPersistentProjectState(project: ProjectModel) {
        sessionStorage.setItem(StorageKeys.OpenedProject,project.id);
    }

    closeProject() {
        this._openedProject.set(null);
        sessionStorage.removeItem(StorageKeys.OpenedProject);
    }
    
    fetchProjects(): Promise<Array<ProjectModel>> {
        if (this.hasProjects()) {
            return Promise.resolve(this._projects())
        }

        const projects$ = this.http.get<Array<ProjectModel>>(`${environment.apiBaseUrl}/projects/`).pipe(
            tap((projects: Array<ProjectModel>) => {
                this._projects.set(projects)
            })
        )
        return lastValueFrom(projects$);
    }

    private fetchProjectById(projectId: string): Observable<ProjectModel> {
        return this.http.get<ProjectModel>(`${environment.apiBaseUrl}/projects/${projectId}/`);
    }

    isProjectOpen(): boolean {
        const storedProject = sessionStorage.getItem(StorageKeys.OpenedProject);
        if (!storedProject || !this.openedProject())
            return false
        return true;
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