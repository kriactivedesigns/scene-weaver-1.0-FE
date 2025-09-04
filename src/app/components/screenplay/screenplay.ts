import { Component } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages";

@Component({
    selector: 'app-screenplay',
    templateUrl: './screenplay.html',
    styleUrls: ['./screenplay.scss'],
    standalone: true
})
export class Screenplay extends BaseComponent {

    navigateToNextPage() {
        this.goTo(Pages.Storyboard)
    }
    
}