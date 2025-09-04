import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LoginState } from "../../services/login-state.service";
import { GlobalState } from "../../services/global-state.service";
import { GenerationService } from "../../services/generative.service";
import { ProjectMetadata } from "../../models/project-metadata.model";
import { ProjectState } from "../../state/project.state";
import { Pages } from "../../enums/pages";

export abstract class BaseComponent {
    protected loginState = inject(LoginState);
    protected globalState = inject(GlobalState);
    protected generativeService = inject(GenerationService);
    protected projectState = inject(ProjectState);
    protected router = inject(Router);  
    public Pages = Pages;  

    protected goTo(project: ProjectMetadata): void;
    protected goTo(page: string): void;
    protected goTo(arg: string | ProjectMetadata): void {
        if (arg === Pages.Dashboard || arg === Pages.Login) {
            this.router.navigate([`/${arg}`]);
        } else if (typeof arg === 'string') {
            const currentProjectId = this.projectState.currentProjectId;
            this.router.navigate([`/${arg}`], { 
                queryParams: currentProjectId ? { projectId: currentProjectId } : {} 
            });
        } else {
            this.router.navigate([Pages.Realm], { queryParams: { projectId: arg.id } });
        }
    }

}