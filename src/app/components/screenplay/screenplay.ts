import { Component } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { ScreenplaySceneComponent } from "../../shared/components/screenplay-scene/screenplay-scene";

@Component({
    selector: 'app-screenplay',
    templateUrl: './screenplay.html',
    styleUrls: ['./screenplay.scss'],
    standalone: true,
    imports: [
        IconButton,
        ScreenplaySceneComponent
    ]
})
export class Screenplay extends BaseComponent {

    navigateTo(page: Pages) {
        this.goTo(page);
    }
    
}