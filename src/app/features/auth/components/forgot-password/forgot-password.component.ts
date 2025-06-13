import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// TODO: Backend - Create Password Reset Interfaces
/*
interface PasswordResetRequest {
  email: string;
}

interface PasswordResetToken {
  token: string;
  email: string;
  expiresAt: Date;
  isUsed: boolean;
}

interface PasswordResetResponse {
  success: boolean;
  message: string;
  email: string;
}
*/

// TODO: Backend - Database Schema Updates
/*
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  token VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_email ON password_reset_tokens(email);
CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);

-- Add rate limiting columns to users table
ALTER TABLE users
ADD COLUMN password_reset_count INTEGER DEFAULT 0,
ADD COLUMN last_password_reset_request TIMESTAMP WITH TIME ZONE;
*/

// TODO: Backend - API Endpoints
/*
POST /api/auth/forgot-password
- Validate email exists
- Check rate limiting
- Generate unique token
- Store token with expiration
- Send reset email
- Return success response

POST /api/auth/reset-password
- Validate token
- Check expiration
- Update password
- Invalidate token
- Return success

POST /api/auth/validate-reset-token
- Check if token exists and is valid
- Return token status
*/

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  emailSent = false;
  sentToEmail = '';
  canResend = true;
  countdown = 60;
  private countdownInterval?: any;

  constructor(
    private fb: FormBuilder,
    private router: Router
    // TODO: Inject Services
    // private authService: AuthService,
    // private notificationService: NotificationService,
    // private emailService: EmailService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
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
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const email = this.forgotPasswordForm.value.email;

      try {
        // TODO: Implement password reset request
        /*
        const response = await this.authService.requestPasswordReset(email);

        if (response.success) {
          // Send reset email
          await this.emailService.sendPasswordResetEmail({
            to: email,
            resetToken: response.token,
            expiresIn: '1 hour'
          });

          this.emailSent = true;
          this.sentToEmail = email;
          this.startResendCountdown();
          this.notificationService.success('Email de réinitialisation envoyé !');
        }
        */

        // Mock API delay
        setTimeout(() => {
          this.isLoading = false;
          this.emailSent = true;
          this.sentToEmail = email;
          this.startResendCountdown();
        }, 2000);

      } catch (error) {
        this.isLoading = false;

        // TODO: Handle specific error cases
        /*
        switch (error.code) {
          case 'EMAIL_NOT_FOUND':
            this.notificationService.error('Aucun compte associé à cet email');
            break;
          case 'RATE_LIMIT_EXCEEDED':
            this.notificationService.error('Trop de tentatives. Veuillez réessayer plus tard.');
            break;
          case 'EMAIL_SEND_FAILED':
            this.notificationService.error('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
            break;
          default:
            this.notificationService.error('Une erreur est survenue. Veuillez réessayer.');
            console.error('Password reset error:', error);
        }
        */
      }
    } else {
      this.forgotPasswordForm.get('email')?.markAsTouched();
    }
  }

  async resendEmail(): Promise<void> {
    if (this.canResend && this.sentToEmail) {
      try {
        // TODO: Implement resend functionality
        /*
        const response = await this.authService.requestPasswordReset(this.sentToEmail);
        
        if (response.success) {
          await this.emailService.sendPasswordResetEmail({
            to: this.sentToEmail,
            resetToken: response.token,
            expiresIn: '1 hour'
          });

          this.notificationService.success('Email de réinitialisation renvoyé !');
          this.startResendCountdown();
        }
        */

        // Mock resend
        console.log('Resending password reset email to:', this.sentToEmail);
        alert('Email de réinitialisation renvoyé ! (Version démo)');
        this.startResendCountdown();

      } catch (error) {
        // TODO: Handle resend errors
        /*
        this.notificationService.error('Erreur lors du renvoi de l\'email');
        console.error('Resend error:', error);
        */
      }
    }
  }

  private startResendCountdown(): void {
    this.canResend = false;
    this.countdown = 60;
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.canResend = true;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }
}
