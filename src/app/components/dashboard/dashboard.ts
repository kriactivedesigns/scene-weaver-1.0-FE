import { Component, inject, OnInit, signal } from "@angular/core";
import { Header } from "../../shared/components/header/header";
import { HttpClient } from "@angular/common/http";
import { Project } from "../../models/project.model";
import { ProjectCard } from "../../shared/components/project-card/project-card";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss'],
    standalone: true,
    imports: [
        Header,
        ProjectCard
    ]
})
export class Dashboard implements OnInit {
    
    public projects = signal(Array<Project>());
    
    private http = inject(HttpClient)
    
    ngOnInit(): void {
        this.fetchProjects();
    }

    private fetchProjects(): void {
        this.http.get<Array<Project>>('/mock-data/projects.json').subscribe({
            next: (projects) => {
                this.projects.set(projects);
                console.log('Projects fetched successfully:', this.projects);
            },
            error: (error) => {
                console.error('Error fetching projects:', error);
            }
        });
    }
    
}