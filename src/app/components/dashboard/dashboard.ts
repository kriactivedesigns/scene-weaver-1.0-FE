import { Component, effect, signal } from "@angular/core";
import { ProjectCard } from "../../shared/components/project-card/project-card";
import { NewProjectPopup } from "../../shared/components/new-project-popup/new-project-popup";
import { ProjectMetadataModel } from "../../shared/models/project-metadata.model";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";

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

    constructor() {
        super();
        effect(() => {
            if(this.projectState.openedProject()) {
                this.goTo(Pages.Realm);
            }
        })
    }

    createProject() {
        this.openPopup.set(true);
    }
    
    handleCreateProjectOpenChange(value: boolean) {
        this.openPopup.set(value);
    }
    
    handleCreateProjectOutput(project: any) {
        console.log(project);
        this.openPopup.set(false);
        this.projectState.addProject(project);
    }

    handleOpenProjectOutput(project: ProjectMetadataModel): void {
        if(!project.id)
            return;

        this.projectState.openProject(project);
    }

    deleteProject(id: string): void {
        this.projectState.deleteProject(id);
    }

}