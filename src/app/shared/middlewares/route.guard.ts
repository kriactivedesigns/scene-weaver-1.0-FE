import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Pages } from "../enums/pages.enum";
import { ProjectState } from "../state/project.state";
import { LoginState } from "../services/login-state.service";

@Injectable({
    providedIn: 'root'
})
export class RouteGuard implements CanActivate {

    private loginState = inject(LoginState);
    private projectState = inject(ProjectState);
    private router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(state.url.includes(Pages.Login)) {
            this.projectState.closeProject();
            this.loginState.logout(false);
            return true;
        } else if(state.url.includes(Pages.Dashboard)) {
            this.projectState.closeProject();
            return true;
        } else if (this.projectState.isProjectOpen()) {
            return true;
        } else {
            this.router.navigateByUrl(Pages.Dashboard);
            return false;
        }
    }
    
}