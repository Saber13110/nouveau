import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// Interfaces pour les types de données
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: Partial<User>;
  verification_required: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  verification_code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'fedex_access_token';
  private readonly REFRESH_TOKEN_KEY = 'fedex_refresh_token';
  private readonly USER_KEY = 'fedex_user';

  // BehaviorSubject pour suivre l'état de connexion
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Vérifier s'il y a un utilisateur connecté au démarrage
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    const token = this.getToken();
    const userData = localStorage.getItem(this.USER_KEY);

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  verifyEmail(verificationData: VerifyEmailRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/verify-email`, verificationData)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          console.error('Email verification error:', error);
          return throwError(() => error);
        })
      );
  }

  forgotPassword(email: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/forgot-password`, { email })
      .pipe(
        catchError(error => {
          console.error('Forgot password error:', error);
          return throwError(() => error);
        })
      );
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/reset-password`, resetData)
      .pipe(
        catchError(error => {
          console.error('Reset password error:', error);
          return throwError(() => error);
        })
      );
  }

  resendVerificationCode(email: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/resend-verification`, { email })
      .pipe(
        catchError(error => {
          console.error('Resend verification error:', error);
          return throwError(() => error);
        })
      );
  }

  loginWithGoogle(googleToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/google`, { token: googleToken })
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          console.error('Google login error:', error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<{access_token: string; expires_in: number}> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{access_token: string; expires_in: number}>(`${this.API_URL}/refresh`, 
      { refresh_token: refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.access_token);
        }),
        catchError(error => {
          console.error('Token refresh error:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  validateToken(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }),
      catchError(error => {
        console.error('Token validation error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  private handleAuthSuccess(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  updateUser(userData: Partial<User>): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    }
  }
} 