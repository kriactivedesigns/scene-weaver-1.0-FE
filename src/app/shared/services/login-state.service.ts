import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Pages } from '../enums/pages.enum';
import { Router } from '@angular/router';
import { StorageKeys } from '../enums/storagekeys.enum';

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
    sessionStorage.setItem(StorageKeys.LoggedInUser, JSON.stringify(user));
    this.router.navigateByUrl(Pages.Dashboard);
  }

  logout(shouldRedirect: boolean = true): void {
    this._user.set(null);
    this._isLoggedIn.set(false);
    sessionStorage.removeItem(StorageKeys.LoggedInUser);
    if (shouldRedirect)
      this.router.navigateByUrl(Pages.Login);
  }

  ifUserLoggedIn(): boolean {
    if (this.isLoggedIn()) {
      return true;
    }

    const storedUser = sessionStorage.getItem(StorageKeys.LoggedInUser);
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this._user.set(user);
      this._isLoggedIn.set(true);
      return true
    }

    return false;
  }
  
}
