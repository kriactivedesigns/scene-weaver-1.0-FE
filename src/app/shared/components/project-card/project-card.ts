import { Component, inject, input } from "@angular/core";
import { Project } from "../../../models/project.model";
import { Router } from "@angular/router";

@Component({
    selector: 'app-project-card',
    templateUrl: './project-card.html',
    styleUrls: ['./project-card.scss'],
    standalone: true
})
export class ProjectCard {
    
    public project = input.required<Project>();
    private router = inject(Router); 

    public onProjectClick(): void {
        this.router.navigate(['/realm']);
    }
    
}