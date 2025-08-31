import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.html",
  styleUrls: ["./header.scss"]
})
export class Header {

    public page = "dashboard";
    private router = inject(Router);

    goTo(page: string) {
        this.page = page;
        this.router.navigate([`/${page}`]);
    }
    
}