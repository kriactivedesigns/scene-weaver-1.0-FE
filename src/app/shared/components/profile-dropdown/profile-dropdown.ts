import { Component, input } from "@angular/core";
import { Pages } from "../../enums/pages";
import { BaseComponent } from "../base-component/base-component";
import { User } from "../../models/user.model";

@Component({
    selector: 'profile-dropdown',
    templateUrl: './profile-dropdown.html',
    styleUrl: './profile-dropdown.scss'
})
export class ProfileDropdown extends BaseComponent {

    open = input.required<boolean>();
    user = input.required<User | null>();
    
    signOut() {
        this.loginState.logout();
        this.router.navigateByUrl(Pages.Login);
    }
    
}