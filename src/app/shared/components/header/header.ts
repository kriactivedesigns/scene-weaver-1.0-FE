import { Component, inject, input, signal } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.html",
  styleUrls: ["./header.scss"]
})
export class Header {

    public page = input.required<string>();
    private router = inject(Router);

    goTo(page: string) {
        this.router.navigate([`/${page}`]);
    }
    
}