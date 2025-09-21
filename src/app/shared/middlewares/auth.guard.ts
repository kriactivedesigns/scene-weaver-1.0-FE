import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { LoginState } from "../services/login-state.service";
import { Pages } from "../enums/pages.enum";
import { ProjectState } from "../state/project.state";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    private projectState = inject(ProjectState);
    private router = inject(Router);
    private loginState = inject(LoginState);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (!this.loginState.ifUserLoggedIn() && !state.url.includes(Pages.Login)) {
            // If user not logged in and trying to navigate to pages other than login
            // If user trying to navigate to login
            this.projectState.closeProject();
            this.loginState.logout(false);
            this.router.navigateByUrl(Pages.Login);
            return false;
        } else {
            return true;
        }
    }
    
}