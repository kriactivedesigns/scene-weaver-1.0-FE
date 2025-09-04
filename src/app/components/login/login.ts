import { Component, computed, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { customEmailValidator } from "../../shared/extras/customValidators";
import { User } from "../../shared/models/user.model";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { ToggleButtons } from "../../shared/components/toggle-buttons/toggle-buttons";

type Tabs = 'signin' | 'signup';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
    imports: [
        ReactiveFormsModule,
        ToggleButtons
    ]
})
export class Login extends BaseComponent {

    public selectedTab = signal<Tabs>('signin');
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

    readonly selectedButton = computed(() => this.selectedTab() === 'signin' ? 'left' : 'right');

    get email() { return this.form.get('email'); }
    get password() { return this.form.get('password'); }

    public onSubmit(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        const user: User = {
            id: '',
            email: this.email?.value || '',
            name: 'John Doe'
        }
        if(this.selectedTab() === 'signin') {
            // Handle sign-in logic
            console.log('Signining In');
            this.loginState.login(user)
        } else {
            // Handle sign-up logic
            console.log('Signining Up');
            this.loginState.login(user)
        }
    }

    public onSignInToggle(type: any) {
        this.selectedTab.update((current) => current === 'signin' ? 'signup' : 'signin');
    }
    
}