import { Directive, ElementRef, HostListener, inject, input, output, Output } from "@angular/core";

@Directive({
    selector: '[clickOutside]',
    standalone: true
})
export class ClickOutsideDirective {

    clickOutside = output();
    elementRef = inject(ElementRef);

    @HostListener('document:click', ['$event.target'])
    public onClick(target: any) {
        const clickedOutside = this.elementRef.nativeElement.contains(target);
        if (!clickedOutside) {
            this.clickOutside.emit();
        }
    }
    
}