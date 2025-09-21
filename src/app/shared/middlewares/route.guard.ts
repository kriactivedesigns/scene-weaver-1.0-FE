import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { Pages } from "../enums/pages.enum";
import { ProjectState } from "../state/project.state";
import { LoginState } from "../services/login-state.service";
import { StorageKeys } from "../enums/storagekeys.enum";
import { GlobalState } from "../services/global-state.service";

@Injectable({
    providedIn: 'root'
})
export class RouteGuard implements CanActivate {

    private globalState = inject(GlobalState);
    private projectState = inject(ProjectState);
    private router = inject(Router);

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        if (state.url.includes(Pages.Login)) 
            return this.allowOrNotToNavigate(true, state.url);

        // Check if projects loaded
        if (!this.projectState.hasProjects()) {
            try {
                await  this.projectState.fetchProjects();
            } catch (error) {
                this.router.navigateByUrl(Pages.Dashboard);
                return this.allowOrNotToNavigate(false);
            }
        }
    
        if (state.url.includes(Pages.Dashboard)) {
            return this.allowOrNotToNavigate(true, state.url);
        }
    
        const storedProjectId = localStorage.getItem(StorageKeys.OpenedProject);
        const projectExists = this.projectState.projects().some(p => p.id == storedProjectId);
    
        if (projectExists && storedProjectId) {
            try {
            // Allowed to navigate to any paes
                this.projectState.openProject(storedProjectId);
                return this.allowOrNotToNavigate(true, state.url);
            } catch (error) {
                this.router.navigateByUrl(Pages.Dashboard);
                return this.allowOrNotToNavigate(false);
            }
        } else {
            localStorage.removeItem(StorageKeys.OpenedProject);
            this.router.navigateByUrl(Pages.Dashboard);
            return this.allowOrNotToNavigate(false);
        }
    }

    allowOrNotToNavigate(isallowed: boolean, url: string = '') {
        this.globalState.setCurrentPage(url);
        return isallowed;
    }

    
}