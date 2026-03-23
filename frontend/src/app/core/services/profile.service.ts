import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly _currentUser = signal<User | null>(this.loadUserFromStorage());
  readonly currentUser = this._currentUser.asReadonly();

  fetchProfile(): Observable<User> {
    return this.http.get<User>(`${this.API}/profile`).pipe(
      tap((user) => {
        console.log("✅ Profile fetched successfully:", user);
        this.updateLocalUser(user);
      })
    );
  }
  
  private updateLocalUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this._currentUser.set(user);
  }

  private loadUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      try { return user ? JSON.parse(user) : null; } catch (e) { return null; }
    }
    return null;
  }
}