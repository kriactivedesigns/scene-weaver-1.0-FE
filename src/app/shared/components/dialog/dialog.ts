import { Component, input, output } from "@angular/core";
import { ButtonType, DialogData, DialogResult, DialogType } from "../../types/dialog.types";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'dialog',
    templateUrl: 'dialog.html',
    styleUrl: 'dialog.scss',
    imports: [
        CommonModule
    ]
})
export class DialogComponent {

    data = input.required<DialogData>();
    onclose = output<DialogResult>();
    DialogType = DialogType;

    handleButtonClick(type: ButtonType) {
        switch(type) {
            case 'cancel':
                this.onCancel();
                break;
            case 'confirm':
                this.onConfirm();
                break;
            case 'continue':
                this.onContinue()
        }
    }

    onConfirm() {
        this.onclose.emit(DialogResult.Confirm);
    }

    onContinue() {
        this.onclose.emit(DialogResult.Continue);
    }

    onCancel() {
        this.onclose.emit(DialogResult.Cancel);
    }
    
}