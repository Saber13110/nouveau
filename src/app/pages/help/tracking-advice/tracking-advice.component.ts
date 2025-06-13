import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-tracking-advice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking-advice.component.html',
  styleUrls: ['./tracking-advice.component.scss']
})
export class TrackingAdviceComponent {
  constructor(private notificationService: NotificationService) {}

  openTrackingGuide() {
    this.notificationService.show('Opening comprehensive tracking guide...', 'info');
  }

  openStatusGuide() {
    this.notificationService.show('Opening status definitions guide...', 'info');
  }

  openTroubleshooting() {
    this.notificationService.show('Opening troubleshooting wizard...', 'info');
  }

  setupNotifications() {
    this.notificationService.show('Opening notification preferences...', 'info');
  }

  viewDeliveryTimes() {
    this.notificationService.show('Opening delivery time calculator...', 'info');
  }

  learnSecurity() {
    this.notificationService.show('Opening security information...', 'info');
  }
} 