import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthResponse, LoginModel, SignupModel, UserModel } from '../models/user.model';
import { Pages } from '../enums/pages.enum';
import { Router } from '@angular/router';
import { StorageKeys } from '../enums/storagekeys.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginState {

  // Dependency injections
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  // Use signals for reactive state (Angular 16+)
  private _user = signal<UserModel | null>(null);
  private _isLoggedIn = signal<boolean>(false);

  // Public readonly signals
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  
  // Computed values
  readonly userDisplayName = computed(() => 
    this.user()?.name || this.user()?.email || 'Anonymous'
  );

  async login(user: LoginModel): Promise<void> {
    try {
      const response = await firstValueFrom(this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, user));
      this._user.set(response.user);
      this._isLoggedIn.set(true);
      sessionStorage.setItem(StorageKeys.LoggedInUser, JSON.stringify(response.user));
      return
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async signup(user: SignupModel): Promise<void> {
    try {
      const response = await firstValueFrom(this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/signup`, user));
      this._user.set(response.user);
      this._isLoggedIn.set(true);
      sessionStorage.setItem(StorageKeys.LoggedInUser, JSON.stringify(response.user));
      return
    } catch (error) {
      console.error('Login error:', error);
    }
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
