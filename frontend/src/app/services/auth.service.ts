import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
}

interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);

  constructor(private http: HttpClient) {
    this.checkSession();
  }

  /**
   * Login with identifier and password.
   */
  login(identifier: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, { identifier, password }, { withCredentials: true })
      .pipe(
        tap(res => {
          this.currentUser.set(res.data.user);
          this.isAuthenticated.set(true);
        })
      );
  }

  /**
   * Fetch current user profile.
   */
  checkSession() {
    this.http.get<AuthResponse>(`${this.apiUrl}/me`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.currentUser.set(res.data.user);
          this.isAuthenticated.set(true);
        },
        error: () => {
          this.currentUser.set(null);
          this.isAuthenticated.set(false);
        }
      });
  }

  /**
   * Log out the current user.
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUser.set(null);
          this.isAuthenticated.set(false);
        })
      );
  }

  /**
   * Refresh session token.
   */
  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true });
  }

  /**
   * Create account (Superadmin only).
   */
  createAccount(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-account`, userData, { withCredentials: true });
  }
}
