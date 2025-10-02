import { Component, computed, effect, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { customEmailValidator } from "../../shared/extras/custom-validators";
import { LoginModel, SignupModel, UserModel } from "../../shared/models/user.model";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { ToggleButtons } from "../../shared/components/toggle-buttons/toggle-buttons";
import { Pages } from "../../shared/enums/pages.enum";

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
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        email: new FormControl('', [
            Validators.required,
            customEmailValidator
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(5)
        ])
    })

    readonly selectedButton = computed(() => this.selectedTab() === 'signin' ? 'left' : 'right');

    get name() { return this.form.get('name'); }
    get email() { return this.form.get('email'); }
    get password() { return this.form.get('password'); }

    constructor() {
        super();
        effect(() => {
            const tab = this.selectedTab();
            const nameControl = this.form.get('name');
            if (tab === 'signup') {
                nameControl?.setValidators([
                    Validators.required,
                    Validators.minLength(3)
                ]);
            } else {
                nameControl?.clearValidators();
            }
            nameControl?.updateValueAndValidity();
        });
    }

    public onSubmit(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        const user: LoginModel = {
            email : this.email?.value || '',
            password : this.password?.value || ''
        }
        if(this.selectedTab() === 'signin') {
            this.loginState.login(user)
            .then(() => {
                this.router.navigateByUrl(Pages.Dashboard);
            })
            .catch((error) => {
                console.error('Login error:', error);
            });
        } else {
            Object.assign(user, { name: this.name?.value || '' });
            this.loginState.signup(user as SignupModel)
            .then(() => {
                this.router.navigateByUrl(Pages.Dashboard);
            })
            .catch((error) => {
                console.error('Signup error:', error);
            });
        }
    }

    public onSignInToggle() {
        this.selectedTab.update((current) => current === 'signin' ? 'signup' : 'signin');
    }
    
}