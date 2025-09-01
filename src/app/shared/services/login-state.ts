import { Injectable, signal } from "@angular/core";
import { User } from "../../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class LoginState {
    private user = signal<User | null>(null);

    login(user: User) {
        this.user.set(user);
    }

    logout() {
        this.user.set(null);
    }

    getUser() {
        return this.user();
    }

}