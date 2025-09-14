import { Component, input, output } from "@angular/core";
import { UserModel } from "../../models/user.model";
import { ClickOutsideDirective } from "../../directives/click-outside.directive";

@Component({
    selector: 'profile-dropdown',
    templateUrl: './profile-dropdown.html',
    styleUrl: './profile-dropdown.scss',
    imports: [
        ClickOutsideDirective
    ]
})
export class ProfileDropdown {

    onclick = output<string | null>();
    open = input.required<boolean>();
    user = input.required<UserModel | null>();
    isProjectOpened = input.required<boolean>();
    
    menuItemClick(item: string | null) {
        this.onclick.emit(item);
    }

    handleClickOutside() {
        if (this.open())
            this.menuItemClick(null);
    }
    
}