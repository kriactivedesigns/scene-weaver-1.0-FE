import { Component, effect, OnInit, signal } from "@angular/core";
import { ProjectCard } from "../../shared/components/project-card/project-card";
import { NewProjectPopup } from "../../shared/components/new-project-popup/new-project-popup";
import { Project } from "../../shared/models/project.model";
import { BaseComponent } from "../../shared/components/base-component/base-component";

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

    constructor() {
        super();
        effect(() => {
            this.projectState.projects()
        })
    }

    createProject() {
        this.openPopup.set(true);
    }
    
    handleCreateProjectOpenChange(value: boolean) {
        console.log(value);
        this.openPopup.set(value);
    }
    
    handleCreateProjectOutput(project: Project) {
        console.log(project);
        this.openPopup.set(false);
        this.projectState.addProject(project);
    }

}