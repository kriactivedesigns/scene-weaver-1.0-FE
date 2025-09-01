import { effect, inject, signal } from "@angular/core";
import { GlobalState } from "../services/global-state";
import { ActivatedRoute, Router } from "@angular/router";
import { Project } from "../../models/project.model";
import { Pages } from "../../constants/pages";
import { LoginState } from "../services/login-state";

export abstract class BaseComponent {
    protected loginState = inject(LoginState);
    protected globalState = inject(GlobalState);
    protected route = inject(ActivatedRoute);
    protected router = inject(Router);  
    public Pages = Pages;  

    protected goTo(project: Project): void;
    protected goTo(page: string): void;
    protected goTo(arg: string | Project): void {
        if (arg === Pages.Dashboard || arg === Pages.Login) {
            this.router.navigate([`/${arg}`]);
        } else if (typeof arg === 'string') {
            const currentProjectId = this.globalState.getCurrentProject()?.id;
            this.router.navigate([`/${arg}`], { 
                queryParams: currentProjectId ? { projectId: currentProjectId } : {} 
            });
        } else {
            this.router.navigate([Pages.Realm], { queryParams: { projectId: arg.id } });
        }
    }

}