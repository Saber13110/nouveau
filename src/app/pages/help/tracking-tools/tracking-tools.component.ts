import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-tracking-tools',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking-tools.component.html',
  styleUrls: ['./tracking-tools.component.scss']
})
export class TrackingToolsComponent {
  constructor(private notificationService: NotificationService) {}

  openBulkTracking() {
    this.notificationService.show('Opening bulk tracking tool...', 'info');
  }

  openMobileApp() {
    this.notificationService.show('Opening mobile app download page...', 'info');
  }

  openAPI() {
    this.notificationService.show('Opening API documentation...', 'info');
  }

  openEmailTracking() {
    this.notificationService.show('Opening email tracking setup...', 'info');
  }

  openReports() {
    this.notificationService.show('Opening tracking reports...', 'info');
  }

  openIntegrations() {
    this.notificationService.show('Opening integration options...', 'info');
  }
} 