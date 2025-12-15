import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  isEmailVerified: boolean;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signal-based state
  user = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.user());

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setTokens(response.data.accessToken, response.data.refreshToken);
          this.currentUserSubject.next(response.data.user);
          this.user.set(response.data.user);
        }
      })
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setTokens(response.data.accessToken, response.data.refreshToken);
          this.currentUserSubject.next(response.data.user);
          this.user.set(response.data.user);
        }
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/verify-email`, { token });
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.currentUserSubject.next(null);
    this.user.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh`, { refreshToken });
  }

  private loadStoredUser(): void {
    const token = this.getAccessToken();
    if (token) {
      // Load user profile from API
      this.http.get<any>(`${environment.apiUrl}/auth/profile`).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data.user);
            this.user.set(response.data.user);
          }
        },
        error: () => {
          // Token might be expired, clear it
          this.logout();
        },
      });
    }
  }
}
