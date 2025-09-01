import { Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";
import { Pages } from "../../../constants/pages";
import { LoginState } from "../../services/login-state";
import { User } from "../../../models/user.model";

@Component({
    selector: 'profile-dropdown',
    templateUrl: './profile-dropdown.html',
    styleUrl: './profile-dropdown.scss'
})
export class ProfileDropdown {

    private loginState = inject(LoginState);
    open = input.required<boolean>();
    user = input.required<User | null>();
    private router = inject(Router);
    
    signOut() {
        this.loginState.logout();
        this.router.navigateByUrl(Pages.Login);
    }
    
}