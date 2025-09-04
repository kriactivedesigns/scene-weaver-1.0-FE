import { Component, effect } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.html',
    styleUrls: ['./canvas.scss'],
    standalone: true
})
export class Canvas extends BaseComponent { }