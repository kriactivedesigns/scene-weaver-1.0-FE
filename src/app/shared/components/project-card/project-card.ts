import { Component, input, output } from "@angular/core";
import { ProjectMetadataModel } from "../../models/project-metadata.model";
import { DatePipe } from "@angular/common";
import { IconButton } from "../icon-button/icon-button";

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
    
    onopenproject = output<ProjectMetadataModel>();
    ondelete = output<string>();
    public project = input.required<ProjectMetadataModel>();

    openProject(data: ProjectMetadataModel): void {
        this.onopenproject.emit(data);
    }

    onDeleteButtonClick() {
        this.ondelete.emit(this.project().id);
    }
    
}