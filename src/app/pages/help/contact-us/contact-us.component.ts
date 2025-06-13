import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';

interface ContactOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  link?: string;
  isForm?: boolean;
}

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  selectedOption: string | null = null;

  contactOptions: ContactOption[] = [
    {
      id: 'chat',
      icon: 'fa-comments',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      link: '#chat'
    },
    {
      id: 'email',
      icon: 'fa-envelope',
      title: 'Email Support',
      description: 'Send us a detailed message',
      isForm: true
    },
    {
      id: 'phone',
      icon: 'fa-phone-alt',
      title: 'Phone Support',
      description: 'Call us at +1 (800) 123-4567',
      link: 'tel:+18001234567'
    },
    {
      id: 'social',
      icon: 'fa-users',
      title: 'Social Media',
      description: 'Connect with us on social media',
      link: '#social'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      trackingNumber: [''],
      attachments: [[]]
    });
  }

  ngOnInit(): void {}

  selectOption(optionId: string) {
    this.selectedOption = optionId;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      this.notificationService.show('Your message has been sent. We\'ll get back to you soon!', 'success');
      this.contactForm.reset();
      this.selectedOption = null;
    } else {
      this.notificationService.show('Please fill in all required fields correctly.', 'error');
    }
  }

  getErrorMessage(field: string): string {
    const control = this.contactForm.get(field);
    if (!control) return '';
    
    if (control.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${minLength} characters`;
    }
    return '';
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      const attachments = this.contactForm.get('attachments');
      if (attachments) {
        attachments.setValue(Array.from(files));
      }
    }
  }
} 