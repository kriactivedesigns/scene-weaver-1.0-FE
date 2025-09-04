import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { LoginState } from "../services/login-state.service";
import { Pages } from "../enums/pages";
import { GlobalState } from "../services/global-state.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    private globalState = inject(GlobalState);
    private router = inject(Router);
    private loginState = inject(LoginState);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.loginState.ifUserLoggedIn()) {
            this.globalState.setCurrentPage(state.url);
            return true;
        } else {
            console.log('route: ', route)
            console.log('state: ', state)
            this.router.navigateByUrl(Pages.Login)
            return false;
        }
    }
    
}