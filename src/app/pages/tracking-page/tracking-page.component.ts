import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tracking-page',
  templateUrl: './tracking-page.component.html',
  styleUrls: ['./tracking-page.component.scss']
})
export class TrackingPageComponent implements OnInit {
  // Search state
  hasSearched: boolean = false;
  currentTrackingNumber: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Suivre votre colis | Globex Express');
    
    // Check if there's a tracking number in the URL
    this.route.queryParams.subscribe(params => {
      if (params['number'] && params['number'].trim()) {
        this.currentTrackingNumber = params['number'].trim();
        this.hasSearched = true;
      } else {
        this.resetSearch();
      }
    });
  }

  onSearch(trackingNumber: string): void {
    if (!trackingNumber || !trackingNumber.trim()) {
      this.resetSearch();
      return;
    }
    
    this.currentTrackingNumber = trackingNumber.trim();
    this.hasSearched = true;
    
    // Update URL with tracking number
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { number: this.currentTrackingNumber },
      queryParamsHandling: 'merge'
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetSearch(): void {
    this.hasSearched = false;
    this.currentTrackingNumber = '';
    
    // Remove tracking number from URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { number: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
} 