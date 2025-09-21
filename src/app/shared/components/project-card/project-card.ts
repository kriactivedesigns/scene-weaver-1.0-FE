import { Component, input, output } from "@angular/core";
import { DatePipe } from "@angular/common";
import { IconButton } from "../icon-button/icon-button";
import { ProjectModel } from "../../models/project.model";

@Component({
    selector: 'app-project-card',
    templateUrl: './project-card.html',
    styleUrls: ['./project-card.scss'],
    imports: [
        DatePipe,
        IconButton
    ]
})
export class ProjectCard {
    
    onopenproject = output<ProjectModel>();
    ondelete = output<string>();
    public project = input.required<ProjectModel>();

    openProject(data: ProjectModel): void {
        this.onopenproject.emit(data);
    }

    onDeleteButtonClick() {
        this.ondelete.emit(this.project().id);
    }
    
}