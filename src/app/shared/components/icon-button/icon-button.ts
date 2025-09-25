import { Component, input, output } from "@angular/core";
import { ButtonIconType } from "../../types/button-icons";

@Component({
    selector: 'icon-button',
    templateUrl: './icon-button.html',
    styleUrl: './icon-button.scss'
})
export class IconButton {
    type = input<string>();
    icon = input<ButtonIconType>();
    textIcon = input<ButtonIconType>();
    text = input<string>();
    onclick = output<MouseEvent | void>();
    onmousedown = output<MouseEvent>();
    disabled = input<boolean>();
}