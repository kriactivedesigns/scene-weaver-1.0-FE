import { Component, effect, signal } from "@angular/core";
import { BaseComponent } from "../base-component/base-component";
import { ProfileDropdown } from "../profile-dropdown/profile-dropdown";

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

  constructor() {
    super();
    effect(() => {
      console.log('current project id', this.projectState.currentProjectId())
      console.log('current project', this.projectState.currentProject())
    })
  }
  
  openProfileDropdown() {
    this.isDropdownOpen.update((value) => {
      return !value;
    })
  }
  
}