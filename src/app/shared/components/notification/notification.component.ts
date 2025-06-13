import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info' | 'primary';
  title: string;
  message: string;
  duration: number;
  visible: boolean;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription;
  
  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      this.addNotification(notification);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      case 'primary':
        return 'fas fa-bell';
      default:
        return 'fas fa-bell';
    }
  }

  dismissNotification(index: number): void {
    this.notifications[index].visible = false;
    
    // Remove notification after animation
    setTimeout(() => {
      this.notifications = this.notifications.filter((_, i) => i !== index);
    }, 500);
  }

  private addNotification(notification: Notification): void {
    // Add notification to array
    this.notifications.push({
      ...notification,
      visible: false
    });
    
    // Trigger animation in next cycle
    setTimeout(() => {
      const index = this.notifications.length - 1;
      if (index >= 0) {
        this.notifications[index].visible = true;
      }
    }, 50);
    
    // Auto dismiss after duration
    setTimeout(() => {
      const index = this.notifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        this.dismissNotification(index);
      }
    }, notification.duration);
  }
} 