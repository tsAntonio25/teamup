import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiError
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly API       = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'teamup_token';
  private readonly USER_KEY  = 'teamup_user';

  // Reactive signals — use these anywhere in your app
  private readonly _currentUser = signal<User | null>(this.loadUserFromStorage());
  private readonly _token       = signal<string | null>(this.loadTokenFromStorage());

  readonly currentUser   = this._currentUser.asReadonly();
  readonly token         = this._token.asReadonly();
  readonly isLoggedIn    = computed(() => !!this._token() && !!this._currentUser());
  readonly userRole      = computed(() => this._currentUser()?.role ?? null);
  readonly isPartyMaster = computed(() => this._currentUser()?.role === 'partyMaster');
  readonly isCommissioner = computed(() => this._currentUser()?.role === 'commissioner');
  readonly isApprentice  = computed(() => this._currentUser()?.role === 'apprentice');
  readonly isAdmin       = computed(() => this._currentUser()?.role === 'admin');

  // POST /api/auth/login → authController.login()
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API}/login`, credentials)
      .pipe(
        tap(res => this.handleAuthSuccess(res)),
        catchError(err => this.handleError(err))
      );
  }

  // POST /api/auth/register → authController.register()
  // NOTE: Never send role — backend always sets "apprentice"
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API}/register`, data)
      .pipe(
        tap(res => this.handleAuthSuccess(res)),
        catchError(err => this.handleError(err))
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this._token.set(res.token);
    this._currentUser.set(res.user);
  }

  private handleError(err: any): Observable<never> {
    const apiError: ApiError = err.error || { message: 'An unexpected error occurred' };
    return throwError(() => apiError);
  }

  private loadTokenFromStorage(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUserFromStorage(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}