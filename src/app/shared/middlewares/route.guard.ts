import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Pages } from "../enums/pages.enum";
import { ProjectState } from "../state/project.state";
import { StorageKeys } from "../enums/storagekeys.enum";
import { GlobalState } from "../services/global-state.service";
import { STAGE_CONFIG } from "../extras/stage-config";

@Injectable({
    providedIn: 'root'
})
export class RouteGuard implements CanActivate {

    private globalState = inject(GlobalState);
    private projectState = inject(ProjectState);
    private router = inject(Router);

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        // If stage.enabled is false, redirect to dashboard
        if (!STAGE_CONFIG.find(s => state.url.includes(s.route))?.enabled) {
            this.router.navigateByUrl(Pages.Dashboard);
            return false;
        }

        if (state.url.includes(Pages.Login)) 
            return this.allowOrNotToNavigate(true, state.url);

        if (state.url.includes(Pages.Dashboard)) {
            return this.allowOrNotToNavigate(true, state.url);
        }

        // Check if projects loaded
        if (!this.projectState.hasProjects()) {
            try {
                await  this.projectState.fetchProjects();
            } catch (error) {
                return this.allowOrNotToNavigate(false);
            }
        }
    
        const storedProjectId = sessionStorage.getItem(StorageKeys.OpenedProject);
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
            sessionStorage.removeItem(StorageKeys.OpenedProject);
            this.router.navigateByUrl(Pages.Dashboard);
            return this.allowOrNotToNavigate(false);
        }
    }

    allowOrNotToNavigate(isallowed: boolean, url: string = '') {
        this.globalState.setCurrentPage(url);
        return isallowed;
    }
    
}