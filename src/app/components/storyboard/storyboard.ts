import { Component } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";

@Component({
    selector: 'app-storyboard',
    templateUrl: './storyboard.html',
    styleUrls: ['./storyboard.scss'],
    standalone: true
})
export class Storyboard extends BaseComponent {

    navigateToNextPage() {
        this.goTo(Pages.Animatics);
    }
    
}