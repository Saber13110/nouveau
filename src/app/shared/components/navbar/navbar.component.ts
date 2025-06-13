import { Component, OnInit, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  showSearch = false;
  notificationCount = 0;
  quickTrackingNumber: string = '';
  @ViewChild('drawer') drawer!: MatSidenav;
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
    this.drawer?.close();
    this.showSearch = false;
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
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
    this.drawer.toggle();
  }



  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  @HostListener('window:keydown.escape')
  onEscapePress(): void {
    this.closeAllMenus();
  }
}
