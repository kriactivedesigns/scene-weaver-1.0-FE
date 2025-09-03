import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class LoginState {
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
  }

  logout(): void {
    this._user.set(null);
    this._isLoggedIn.set(false);
  }
}
