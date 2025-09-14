import { Component, input, output } from "@angular/core";
import { ButtonIconType } from "../../types/button-icons";

@Component({
    selector: 'icon-button',
    templateUrl: './icon-button.html',
    styleUrl: './icon-button.scss'
})
export class IconButton {
    icon = input.required<ButtonIconType>();
    textIcon = input<ButtonIconType>();
    text = input<string>();
    onclick = output();
    disabled = input<boolean>();
}