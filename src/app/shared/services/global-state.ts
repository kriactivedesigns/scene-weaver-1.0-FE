import { inject, Injectable, signal } from "@angular/core";
import { NewProject, Project } from "../../models/project.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GlobalState {
    private projects = signal<Array<Project>>([]);
    private currentProject = signal<Project | null>(null);
    private currentPage = signal<string>('');
    private http = inject(HttpClient);

    constructor() {
        this.fetchProjects();
    }

    setProjects(projects: Array<Project>): void {
        this.projects.set(projects);
    }

    getProjects(): Array<Project> {
        return this.projects();
    }

    getProjectById(id: string | null): Project | null {
        return this.projects().find(project => project.id === id) || null;
    }

    openProjectWithId(projectId: string): void {
        if(!projectId) {
            this.closeProject()
        } else {
            const currentProject = this.getProjectById(projectId);
            this.currentProject.set(currentProject);
        }
    }

    closeProject() {
        this.currentProject.set(null);
    }
    
    getCurrentProject(): Project | null {
        return this.currentProject();
    }

    setCurrentPage(page: string): void {
        this.currentPage.set(page);
    }

    getCurrentPage(): string {
        return this.currentPage();
    }

    private fetchProjects(): void {
        this.http.get<Array<Project>>('/mock-data/projects.json').subscribe({
            next: (projects) => {
                this.setProjects(projects);
            },
            error: (error) => {
                console.error('Error fetching projects:', error);
            }
        });
    }

    public postProject(data: NewProject): void {
        const project: Project = {
            id: (this.projects().length + 1).toString(),
            projectName: data.projectName,
            description: data.description,
            createdOn: new Date().toISOString().slice(0, 10),
            updatedOn: new Date().toISOString().slice(0, 10)
        }
        this.projects.update((value) => {
            return [...value, project];
        })
        console.log(this.projects())
    }
    
}