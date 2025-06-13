import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit, OnDestroy {
  verificationForm: FormGroup;
  isLoading = false;
  userEmail = '';
  canResend = true;
  countdown = 60;
  private countdownInterval?: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.verificationForm = this.fb.group({
      verificationCode: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/)  // Exactly 6 digits
      ]]
    });
  }

  ngOnInit(): void {
    // Récupérer l'email depuis les paramètres de la route
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'] || 'votre.email@exemple.com';
    });

    // Démarrer le countdown pour le renvoi
    this.startResendCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onSubmit(): void {
    if (this.verificationForm.valid) {
      this.isLoading = true;
      
      const verificationCode = this.verificationForm.value.verificationCode;
      
      // TODO: Implement email verification API call
      // TODO: Handle successful verification -> redirect to login or dashboard
      // TODO: Handle verification errors (invalid code, expired code, etc.)
      
      console.log('Email verification attempt:', {
        email: this.userEmail,
        code: verificationCode
      });
      
      // Mock verification delay
      setTimeout(() => {
        this.isLoading = false;
        alert('Email vérifié avec succès ! (Version démo)');
        // TODO: Replace with actual navigation after successful verification
        this.router.navigate(['/auth/login']);
      }, 2000);
    } else {
      // Marquer le champ comme touché pour afficher l'erreur
      this.verificationForm.get('verificationCode')?.markAsTouched();
    }
  }

  resendCode(): void {
    if (this.canResend && !this.isLoading) {
      // TODO: Implement resend verification code API call
      // TODO: Handle resend response
      
      console.log('Resending verification code to:', this.userEmail);
      alert('Nouveau code envoyé ! (Version démo)');
      
      // Restart countdown
      this.startResendCountdown();
    }
  }

  private startResendCountdown(): void {
    this.canResend = false;
    this.countdown = 60;
    
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.canResend = true;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }
}
