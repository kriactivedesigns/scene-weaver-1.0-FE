import { Component, signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";

@Component({
    selector: 'app-story',
    templateUrl: './story.html',
    styleUrls: ['./story.scss'],
    standalone: true,
    imports: [
        IconButton
    ]
})
export class Story extends BaseComponent {

    isSaving = signal<boolean>(false);
    saveFailed: boolean = false;

    navigateTo(page: Pages) {
        this.goTo(page);
    }
    
}