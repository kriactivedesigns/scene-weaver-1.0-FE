import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { customEmailValidator } from "../../extras/customValidators";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
    imports: [
        ReactiveFormsModule
    ]
})
export class Login {
    public selectedTab: string = 'signin';
    public form = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            customEmailValidator
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ])
    })

    private router = inject(Router);
    
    get email() { return this.form.get('email'); }
    get password() { return this.form.get('password'); }

    public onSubmit(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        if(this.selectedTab === 'signin') {
            // Handle sign-in logic
            this.router.navigate(['/dashboard']);
        } else {
            // Handle sign-up logic
            this.router.navigate(['/dashboard']);
        }
    }
    
}