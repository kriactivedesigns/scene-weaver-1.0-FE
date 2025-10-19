import { Component, effect, OnInit, signal } from "@angular/core";
import { ProjectCard } from "../../shared/components/project-card/project-card";
import { NewProjectPopup } from "../../shared/components/new-project-popup/new-project-popup";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { ProjectModel } from "../../shared/models/project.model";
import { StorageKeys } from "../../shared/enums/storagekeys.enum";

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
        this.openPopup.set(value);
    }
    
    handleCreateProjectOutput(project: any) {
        this.openPopup.set(false);
        this.projectState.addProject(project);
    }

    async handleOpenProjectOutput(project: ProjectModel) {
        await this.projectState.openProject(project.id);
        this.router.navigateByUrl(Pages.Realm);
    }

    deleteProject(id: string): void {
        this.projectState.deleteProject(id);
    }

}