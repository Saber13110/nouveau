import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// TODO: Backend - Create Login Interface
/*
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
  };
  token: string;
  refreshToken: string;
  requires2FA: boolean;
}
*/

// TODO: Backend - Database Schema Updates
/*
ALTER TABLE users
ADD COLUMN refresh_token VARCHAR(255),
ADD COLUMN refresh_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN last_failed_login_attempt TIMESTAMP WITH TIME ZONE,
ADD COLUMN failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN account_locked_until TIMESTAMP WITH TIME ZONE;

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  refresh_token VARCHAR(255) NOT NULL,
  device_info JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token);
*/

// TODO: Backend - API Endpoints
/*
POST /api/auth/login
- Validate credentials
- Check account status (locked, requires verification, etc.)
- Generate JWT and refresh token
- Store session info
- Return tokens and user data

POST /api/auth/refresh-token
- Validate refresh token
- Generate new JWT
- Update session
- Return new tokens

POST /api/auth/logout
- Revoke refresh token
- Clear session
- Return success

POST /api/auth/google/login
- Validate Google token
- Find or create user
- Generate tokens
- Return user and tokens
*/

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
    // TODO: Inject Services
    // private authService: AuthService,
    // private notificationService: NotificationService,
    // private storageService: StorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // TODO: Check if user is already logged in
    /*
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    */

    // TODO: Auto-fill remembered credentials
    /*
    const savedEmail = this.storageService.getItem('remembered_email');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail });
    }
    */
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      try {
        const credentials = this.loginForm.value;

        // TODO: Implement authentication service call
        /*
        const response = await this.authService.login(credentials);

        if (response.requires2FA) {
          this.router.navigate(['/auth/2fa'], {
            queryParams: { email: credentials.email }
          });
          return;
        }

        // Handle "Remember Me"
        if (credentials.rememberMe) {
          this.storageService.setItem('remembered_email', credentials.email);
        } else {
          this.storageService.removeItem('remembered_email');
        }

        // Store tokens
        this.authService.setTokens(response.token, response.refreshToken);

        // Show success message
        this.notificationService.success('Connexion réussie !');

        // Redirect to dashboard
        this.router.navigate(['/dashboard']);
        */

        // Mock login delay (remove in production)
        setTimeout(() => {
          this.isLoading = false;
          alert('Connexion réussie ! (Version démo)');
          this.router.navigate(['/dashboard']);
        }, 2000);

      } catch (error) {
        this.isLoading = false;

        // TODO: Handle specific error cases
        /*
        switch (error.code) {
          case 'INVALID_CREDENTIALS':
            this.notificationService.error('Email ou mot de passe incorrect');
            break;
          case 'ACCOUNT_LOCKED':
            this.notificationService.error('Compte temporairement bloqué. Veuillez réessayer plus tard.');
            break;
          case 'EMAIL_NOT_VERIFIED':
            this.router.navigate(['/auth/verify-email'], {
              queryParams: { email: this.loginForm.get('email')?.value }
            });
            break;
          default:
            this.notificationService.error('Une erreur est survenue lors de la connexion');
            console.error('Login error:', error);
        }
        */
      }
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      this.isLoading = true;

      // TODO: Implement Google OAuth login
      /*
      const googleUser = await this.authService.signInWithGoogle();
      const response = await this.authService.handleGoogleLogin(googleUser);

      // Store tokens
      this.authService.setTokens(response.token, response.refreshToken);

      // Show success message
      this.notificationService.success('Connexion réussie !');

      // Redirect to dashboard
      this.router.navigate(['/dashboard']);
      */

      console.log('Google login clicked');
      alert('Google OAuth sera implémenté prochainement !');
    } catch (error) {
      // TODO: Handle Google login errors
      /*
      this.notificationService.error('Erreur lors de la connexion avec Google');
      console.error('Google login error:', error);
      */
    } finally {
      this.isLoading = false;
    }
  }
}
