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
  private _token = signal<string | null>(null);
  private _refreshToken = signal<string | null>(null);
  private _isLoggedIn = signal<boolean>(false);

  // Public readonly signals
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly token = this._token.asReadonly();
  
  // Computed values
  readonly userDisplayName = computed(() => 
    this.user()?.name || this.user()?.email || 'Anonymous'
  );

  async login(user: LoginModel): Promise<void> {
    try {
      const response = await firstValueFrom(this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, user));
      this._setAuthData(response);
      return
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async signup(user: SignupModel): Promise<void> {
    try {
      const response = await firstValueFrom(this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/signup`, user));
      this._setAuthData(response);
      return
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  logout(shouldRedirect: boolean = true): void {
    this._clearAuthData();
    if (shouldRedirect)
      this.router.navigateByUrl(Pages.Login);
  }

  async reAuth(): Promise<void> {
    try {
      const response = await firstValueFrom(this.http.post<{ access_token: string }>(`${environment.apiBaseUrl}/auth/refresh`, {
        refresh_token: this._refreshToken()
      }));
      const currentAuthData: AuthResponse = JSON.parse(localStorage.getItem(StorageKeys.AuthResponse) || '{}');
      this._setAuthData({
        ...currentAuthData,
        access_token: response.access_token
      });
      return
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  ifUserLoggedIn(): boolean {
    if (this.isLoggedIn()) {
      return true;
    }

    const storedAuth = localStorage.getItem(StorageKeys.AuthResponse);
    
    if (storedAuth) {
      const authData: AuthResponse = JSON.parse(storedAuth);
      this._setAuthData(authData);
      return true;
    }

    return false;
  }

  private _setAuthData(authResponse: AuthResponse): void {
    this._user.set(authResponse.user);
    this._token.set(authResponse.access_token);
    this._refreshToken.set(authResponse.refresh_token);
    this._isLoggedIn.set(true);
    localStorage.setItem(StorageKeys.AuthResponse, JSON.stringify(authResponse));
  }

  private _clearAuthData(): void {
    this._user.set(null);
    this._token.set(null);
    this._refreshToken.set(null);
    this._isLoggedIn.set(false);
    localStorage.removeItem(StorageKeys.AuthResponse);
  }
  
}
