import { Component, DOCUMENT, effect, ElementRef, inject, input, output } from "@angular/core";
import { User } from "../../models/user.model";

@Component({
    selector: 'profile-dropdown',
    templateUrl: './profile-dropdown.html',
    styleUrl: './profile-dropdown.scss'
})
export class ProfileDropdown {

    onclick = output<string | null>();
    open = input.required<boolean>();
    user = input.required<User | null>();
    isProjectOpened = input.required<boolean>();
 
    private elementRef = inject(ElementRef);
    private document = inject(DOCUMENT);

    constructor() {
        effect((onCleanup) => {
            const handleClickOutside = (event: MouseEvent) => {
                if (!this.elementRef.nativeElement.contains(event.target as Node) && this.open()) {
                    this.menuItemClick(null);
                }
            }

            this.document.addEventListener('click', handleClickOutside);

            onCleanup(() => {
                this.document.removeEventListener('click', handleClickOutside);
            });
        })
    }
    
    menuItemClick(item: string | null) {
        this.onclick.emit(item);
    }
    
}