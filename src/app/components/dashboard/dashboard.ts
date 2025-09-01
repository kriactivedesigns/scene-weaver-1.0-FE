import { Component, signal } from "@angular/core";
import { ProjectCard } from "../../shared/components/project-card/project-card";
import { BaseComponent } from "../../shared/classes/base-component";
import { NewProjectPopup } from "../../shared/components/new-project-popup/new-project-popup";
import { NewProject } from "../../models/project.model";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss'],
    standalone: true,
    imports: [
        ProjectCard,
        NewProjectPopup
    ]
})
export class Dashboard extends BaseComponent {

    openPopup = signal<boolean>(false);

    createProject() {
        this.openPopup.set(true);
    }
    
    handleOpenChange(value: boolean) {
        console.log(value);
        this.openPopup.set(value);
    }
    
    handleProjectCreate(project: NewProject) {
        console.log(project);
        this.openPopup.set(false);
        this.globalState.postProject(project);
    }

}