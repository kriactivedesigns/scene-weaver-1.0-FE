import { Component, input, output } from "@angular/core";
import { ProjectMetadata } from "../../models/project-metadata.model";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-project-card',
    templateUrl: './project-card.html',
    styleUrls: ['./project-card.scss'],
    imports: [
        DatePipe
    ]
})
export class ProjectCard {
    
    onOpenProject = output<ProjectMetadata>();
    public project = input.required<ProjectMetadata>();

    openProject(data: ProjectMetadata): void {
        this.onOpenProject.emit(data);
    }
    
}