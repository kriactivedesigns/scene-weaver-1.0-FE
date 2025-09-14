import { AfterViewInit, Component, ElementRef, output, ViewChild } from "@angular/core";
import { ClickOutsideDirective } from "../../directives/click-outside.directive";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-floating-prompt',
    templateUrl: 'floating-prompt.html',
    styleUrl: 'floating-prompt.scss',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideDirective
    ]
})
export class FloatingPrompt implements AfterViewInit {

    @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
    
    promptSubmit = output<string>();
    close = output<void>();

    promptText = '';

    ngAfterViewInit(): void {
        setTimeout(() => this.inputElement.nativeElement.focus(), 0);
    }

    onSubmit(): void {
        if (this.promptText.trim()) {
            this.promptSubmit.emit(this.promptText);
        }
    }

    onCancel() {
        this.close.emit();
    }
    
}