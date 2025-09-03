import { AbstractControl } from "@angular/forms";

export function customEmailValidator(control: AbstractControl) {
    const value = control.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if(!value || emailRegex.test(value)) {
        return null; // valid
    }
    return { 
        invalidEmail: {
            message: 'Invalid Email'
        } 
    }; // invalid
}