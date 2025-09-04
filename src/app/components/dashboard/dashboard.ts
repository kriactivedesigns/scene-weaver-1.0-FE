import { Component, OnInit, signal } from "@angular/core";
import { ProjectCard } from "../../shared/components/project-card/project-card";
import { NewProjectPopup } from "../../shared/components/new-project-popup/new-project-popup";
import { ProjectMetadata } from "../../shared/models/project-metadata.model";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages";

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
export class Dashboard extends BaseComponent implements OnInit {

    openPopup = signal<boolean>(false);
    
    ngOnInit(): void {
        this.projectState.fetchProjects(); 
    }

    createProject() {
        this.openPopup.set(true);
    }
    
    handleCreateProjectOpenChange(value: boolean) {
        console.log(value);
        this.openPopup.set(value);
    }
    
    handleCreateProjectOutput(project: ProjectMetadata) {
        console.log(project);
        this.openPopup.set(false);
        this.projectState.addProject(project);
    }

    handleOpenProjectOutput(project: ProjectMetadata): void {
        if(!project.id)
            return;

        this.projectState.openProject(project);
        this.goTo(Pages.Realm);
    }

}