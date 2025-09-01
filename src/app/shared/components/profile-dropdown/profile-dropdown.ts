import { Component, effect, inject, input } from "@angular/core";
import { Router } from "@angular/router";
import { Pages } from "../../../constants/pages";

@Component({
    selector: 'profile-dropdown',
    templateUrl: './profile-dropdown.html',
    styleUrl: './profile-dropdown.scss'
})
export class ProfileDropdown {

    open = input.required<boolean>();
    private router = inject(Router);

    constructor() {
        effect(() => {
            console.log(this.open());
        })
    }
    
    signOut() {
        this.router.navigateByUrl(Pages.Login);
    }
    
}