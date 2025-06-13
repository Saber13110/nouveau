import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../features/auth/services/auth.service';

interface ShipmentActivity {
  trackingNumber: string;
  status: string;
  date: Date;
  location: string;
  type: 'sent' | 'received';
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountId: string;
  memberSince: Date;
  lastUpdate: Date;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: string;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  activeTab: 'personal' | 'shipments' | 'preferences' | 'security' = 'personal';
  isEditing = false;
  
  recentActivities: ShipmentActivity[] = [
    {
      trackingNumber: 'FDX123456789',
      status: 'Delivered',
      date: new Date('2024-03-15'),
      location: 'Paris, France',
      type: 'received'
    },
    {
      trackingNumber: 'FDX987654321',
      status: 'In Transit',
      date: new Date('2024-03-14'),
      location: 'Lyon, France',
      type: 'sent'
    }
  ];

  userProfile: UserProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    accountId: 'ag9fw2thm',
    memberSince: new Date('2025-06-09'),
    lastUpdate: new Date('2025-06-09'),
    emailVerified: false,
    twoFactorEnabled: false,
    address: {
      street: '123 Rue de la Paix',
      city: 'Paris',
      state: 'Île-de-France',
      zipCode: '75001',
      country: 'France'
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      language: 'fr'
    }
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      preferences: this.fb.group({
        emailNotifications: [true],
        smsNotifications: [false],
        language: ['fr']
      })
    });
  }

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.authService.validateToken().subscribe({
      next: (user: User) => {
        this.userProfile = {
          ...this.userProfile,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accountId: String(user.id),
          memberSince: new Date(user.createdAt),
          lastUpdate: user.updatedAt ? new Date(user.updatedAt) : this.userProfile.lastUpdate,
          emailVerified: user.isEmailVerified,
          twoFactorEnabled: user.isTwoFactorEnabled ?? this.userProfile.twoFactorEnabled
        };
        this.profileForm.patchValue(this.userProfile);
      },
      error: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  switchTab(tab: 'personal' | 'shipments' | 'preferences' | 'security'): void {
    this.activeTab = tab;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue(this.userProfile);
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.userProfile = this.profileForm.value;
      this.isEditing = false;
      // TODO: Implement API call to save profile
      console.log('Profile saved:', this.userProfile);
    }
  }

  changePassword(): void {
    // TODO: Implement password change logic
    console.log('Change password clicked');
  }

  deleteAccount(): void {
    // TODO: Implement account deletion logic
    console.log('Delete account clicked');
  }
} 