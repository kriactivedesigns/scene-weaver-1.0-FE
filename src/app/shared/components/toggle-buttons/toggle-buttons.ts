import { Component, computed, input, output, signal } from "@angular/core";

type Buttons = 'left' | 'right';

@Component({
    selector: 'toggle-buttons',
    templateUrl: './toggle-buttons.html',
    styleUrl: './toggle-buttons.scss'
})
export class ToggleButtons {
    selectedSide = input<Buttons>('left');
    buttonNames = input<Array<string>>(['left', 'right'])
    onclick = output<Buttons>();
    readonly active = computed<Buttons>(() => this.selectedSide())

    public onButtonToggle() {
        this.onclick.emit(this.active());
    }
    
}