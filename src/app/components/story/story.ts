import { Component } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages";

@Component({
    selector: 'app-story',
    templateUrl: './story.html',
    styleUrls: ['./story.scss'],
    standalone: true
})
export class Story extends BaseComponent {

    navigateToNextPage() {
        this.goTo(Pages.Screenplay);
    }
    
}