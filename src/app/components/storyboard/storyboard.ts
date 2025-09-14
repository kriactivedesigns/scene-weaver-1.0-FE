import { Component } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";

@Component({
    selector: 'app-storyboard',
    templateUrl: './storyboard.html',
    styleUrls: ['./storyboard.scss'],
    standalone: true,
    imports: [
        IconButton
    ]
})
export class Storyboard extends BaseComponent {

    navigateTo(page: Pages) {
        this.goTo(page);
    }
    
}