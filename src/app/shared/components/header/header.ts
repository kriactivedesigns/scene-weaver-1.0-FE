import { Component, computed, effect, output, signal } from "@angular/core";
import { BaseComponent } from "../base-component/base-component";
import { ProfileDropdown } from "../profile-dropdown/profile-dropdown";
import { Pages } from "../../enums/pages.enum";

@Component({
  selector: "app-header",
  templateUrl: "./header.html",
  styleUrls: ["./header.scss"],
  imports: [
    ProfileDropdown
  ]
})
export class Header extends BaseComponent {
  
  isProjectOpened = computed(() => this.projectState.openedProject() ? true : false );
  isDropdownOpen = signal<boolean>(false);
  
  openProfileDropdown() {
    this.isDropdownOpen.update((value) => {
      return !value;
    })
  }

  onMenuItemClick(item: string | null) {
    switch(item) {
      case 'close':
        this.projectState.closeProject();
        this.router.navigateByUrl(Pages.Dashboard);
        this.openProfileDropdown();
        break;
      case 'signout':
        this.loginState.logout();
        this.openProfileDropdown();
        break;
      default:
        this.isDropdownOpen.set(false);
    }
  }
  
}