import { Injectable } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  show(message: string, type: NotificationType = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--white);
      border-left: 4px solid var(--blue-500);
      padding: 16px 20px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      transform: translateX(100%);
      transition: var(--transition);
      max-width: 400px;
      border: 1px solid var(--gray-200);
    `;

    // Set border color based on type
    const borderColors = {
      success: 'var(--green-500)',
      error: 'var(--primary-red)',
      warning: 'var(--yellow-500)',
      info: 'var(--blue-500)'
    };
    notification.style.borderLeftColor = borderColors[type];

    // Set content with icon
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-times-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };

    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <i class="${icons[type]}" style="color: ${borderColors[type]}; margin-top: 2px;" aria-hidden="true"></i>
        <div style="flex: 1; color: var(--gray-700);">${message}</div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; font-size: 16px; cursor: pointer; color: var(--gray-400); padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;"
                aria-label="Close notification">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 5000);

    // Announce to screen readers
    this.announceToScreenReader(message);
  }

  private announceToScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
} 