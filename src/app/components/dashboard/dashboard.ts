import { Component } from "@angular/core";
import { Header } from "../../shared/components/header/header";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss'],
    imports: [
        Header
    ]
})
export class Dashboard {
}