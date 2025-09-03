import { Component, input } from "@angular/core";
import { Project } from "../../models/project.model";
import { BaseComponent } from "../base-component/base-component";

@Component({
    selector: 'app-project-card',
    templateUrl: './project-card.html',
    styleUrls: ['./project-card.scss'],
    standalone: true
})
export class ProjectCard extends BaseComponent {
    
    public project = input.required<Project>();
    
}