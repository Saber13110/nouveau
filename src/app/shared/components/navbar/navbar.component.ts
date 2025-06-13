import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  showSearch = false;
  notificationCount = 0;
  quickTrackingNumber: string = '';
  activeDropdown: string | null = null;
  isMobileMenuOpen = false;
  private routerSubscription: Subscription;
  isDesktop = window.innerWidth >= 992;

  constructor(private router: Router) {
    // S'abonner aux événements de navigation pour fermer les menus
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeAllMenus();
    });
  }

  ngOnInit(): void {
    this.notificationCount = 3;
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkScreenSize(): void {
    this.isDesktop = window.innerWidth >= 992;
  }

  private closeAllMenus(): void {
    this.activeDropdown = null;
    this.isMobileMenuOpen = false;
    this.showSearch = false;
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.activeDropdown = null;
    }
  }

  quickTrack(): void {
    if (this.quickTrackingNumber?.trim()) {
      this.router.navigate(['/tracking'], {
        queryParams: { 
          number: this.quickTrackingNumber.trim(),
          type: 'quick'
        }
      });
      this.quickTrackingNumber = '';
      this.closeAllMenus();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.activeDropdown = null;
    }
  }

  toggleDropdown(event: Event, dropdown: string): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.activeDropdown === dropdown) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = dropdown;
    }

    // Sur mobile, ajuster le scroll pour voir le menu déroulant
    if (!this.isDesktop && this.activeDropdown) {
      setTimeout(() => {
        const dropdownElement = (event.target as HTMLElement).closest('.dropdown');
        dropdownElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && 
        !target.closest('.navbar__toggle') && 
        !target.closest('.navbar__search')) {
      this.closeAllMenus();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
    if (this.isDesktop) {
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('window:keydown.escape')
  onEscapePress(): void {
    this.closeAllMenus();
  }
}
