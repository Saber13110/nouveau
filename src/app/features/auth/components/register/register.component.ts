import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// TODO: Backend - Create User Interface
/*
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Hashed
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  googleId?: string; // For Google OAuth
}
*/

// TODO: Backend - Database Schema
/*
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE,
  google_id VARCHAR(255) UNIQUE,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
*/

// TODO: Backend - API Endpoints
/*
POST /api/auth/register
- Validate input
- Check if email exists
- Hash password
- Create user
- Send verification email
- Return user data (without password)

POST /api/auth/verify-email
- Verify token
- Update user isEmailVerified
- Return success

POST /api/auth/google
- Validate Google token
- Find or create user
- Generate JWT
- Return user and token
*/

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  passwordRequirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  };

  constructor(
    private fb: FormBuilder,
    private router: Router
    // TODO: Inject AuthService
    // private authService: AuthService,
    // TODO: Inject NotificationService
    // private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    // Surveiller les changements de mot de passe pour la validation en temps réel
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.updatePasswordRequirements(password);
    });
  }

  private updatePasswordRequirements(password: string): void {
    this.passwordRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      try {
        const formData = this.registerForm.value;
        
        // TODO: Backend - Implement registration service
        // const result = await this.authService.register({
        //   firstName: formData.firstName,
        //   lastName: formData.lastName,
        //   email: formData.email,
        //   password: formData.password
        // });

        // TODO: Backend - Send welcome email
        /*
        await this.emailService.sendWelcomeEmail({
          to: formData.email,
          firstName: formData.firstName,
          verificationToken: result.verificationToken
        });
        */

        // TODO: Backend - Handle successful registration
        // this.notificationService.success('Inscription réussie ! Veuillez vérifier votre email.');
        
        // Redirection vers la page de vérification d'email
        this.router.navigate(['/auth/verify-email'], { 
          queryParams: { email: formData.email } 
        });
      } catch (error) {
        // TODO: Backend - Handle registration errors
        /*
        if (error.code === 'EMAIL_EXISTS') {
          this.notificationService.error('Cette adresse email est déjà utilisée.');
        } else {
          this.notificationService.error('Une erreur est survenue lors de l\'inscription.');
        }
        console.error('Registration error:', error);
        */
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  async signUpWithGoogle(): Promise<void> {
    // TODO: Backend - Implement Google OAuth
    /*
    try {
      const googleUser = await this.authService.signInWithGoogle();
      const result = await this.authService.handleGoogleSignIn(googleUser);
      
      if (result.isNewUser) {
        this.notificationService.success('Compte créé avec succès !');
      }
      
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.notificationService.error('Erreur lors de la connexion avec Google');
      console.error('Google sign-in error:', error);
    }
    */
  }
}
