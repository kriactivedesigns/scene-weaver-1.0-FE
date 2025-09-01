import { Component, effect, signal } from "@angular/core";
import { BaseComponent } from "../../classes/base-component";
import { ProfileDropdown } from "../profile-dropdown/profile-dropdown";
import { User } from "../../../models/user.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.html",
  styleUrls: ["./header.scss"],
  imports: [
    ProfileDropdown
  ]
})
export class Header extends BaseComponent {
  
  isDropdownOpen = signal<boolean>(false);
  
  openProfileDropdown() {
    this.isDropdownOpen.update((value) => {
      return !value;
    })
  }
  
}