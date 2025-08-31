import { Component } from "@angular/core";
import { Header } from "../../shared/components/header/header";

@Component({
    selector: 'app-realm',
    templateUrl: './realm.html',
    styleUrls: ['./realm.scss'],
    standalone: true,
    imports: [
        Header
    ]
})
export class Realm {
}