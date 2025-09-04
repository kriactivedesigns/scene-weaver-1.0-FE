import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Pages } from '../enums/pages';
import { Router } from '@angular/router';

export enum SessionStorageKeys {
  LoggedInUser = 'loggedinuser'
}

@Injectable({ providedIn: 'root' })
export class LoginState {

  // Dependency injections
  private router = inject(Router);
  // Use signals for reactive state (Angular 16+)
  private _user = signal<User | null>(null);
  private _isLoggedIn = signal<boolean>(false);

  // Public readonly signals
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  
  // Computed values
  readonly userDisplayName = computed(() => 
    this.user()?.name || this.user()?.email || 'Anonymous'
  );

  login(user: User): void {
    this._user.set(user);
    this._isLoggedIn.set(true);
    sessionStorage.setItem(SessionStorageKeys.LoggedInUser, JSON.stringify(user));
    this.router.navigateByUrl(Pages.Dashboard);
  }

  logout(): void {
    this._user.set(null);
    this._isLoggedIn.set(false);
    this.router.navigateByUrl(Pages.Login);
    sessionStorage.removeItem(SessionStorageKeys.LoggedInUser);
  }

  ifUserLoggedIn(): boolean {
    const storedUser = sessionStorage.getItem(SessionStorageKeys.LoggedInUser);
    if (this.isLoggedIn()) {
      return true;
    }
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.login(user);
      return true
    }
    
    return false;
  }
  
}
