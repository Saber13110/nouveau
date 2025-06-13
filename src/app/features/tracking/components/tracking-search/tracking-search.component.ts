import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tracking-search',
  templateUrl: './tracking-search.component.html',
  styleUrls: ['./tracking-search.component.scss']
})
export class TrackingSearchComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  
  trackingNumber: string = '';
  
  // Flags for animations and UI state
  isSearching: boolean = false;
  searchError: string | null = null;
  showRecentSearches: boolean = false;
  
  // Recent searches history
  recentSearches: string[] = [];

  constructor() { }

  ngOnInit(): void {
    // Load recent searches from localStorage
    this.loadRecentSearches();
  }

  onSearch(event: Event): void {
    event.preventDefault();
    
    if (!this.trackingNumber || this.trackingNumber.trim() === '') {
      this.searchError = 'Veuillez entrer un numéro de suivi';
      return;
    }
    
    // Basic validation: Min length and alphanumeric check
    if (this.trackingNumber.length < 8) {
      this.searchError = 'Le numéro de suivi est trop court';
      return;
    }
    
    if (!/^[a-zA-Z0-9-]+$/.test(this.trackingNumber)) {
      this.searchError = 'Le numéro de suivi contient des caractères invalides';
      return;
    }
    
    this.searchError = null;
    this.isSearching = true;
    
    // Add to recent searches
    this.addToRecentSearches(this.trackingNumber);
    
    // Emit search event
    this.search.emit(this.trackingNumber);
    
    // Reset state after a delay (simulating loading)
    setTimeout(() => {
      this.isSearching = false;
    }, 1500);
  }

  useExampleNumber(): void {
    this.trackingNumber = 'GLX123456789';
  }

  clearSearch(): void {
    this.trackingNumber = '';
    this.searchError = null;
  }

  toggleRecentSearches(): void {
    this.showRecentSearches = !this.showRecentSearches;
  }

  selectRecentSearch(trackingNumber: string): void {
    this.trackingNumber = trackingNumber;
    this.showRecentSearches = false;
  }

  deleteRecentSearch(index: number, event: Event): void {
    event.stopPropagation(); // Prevent the click from selecting the tracking number
    this.recentSearches.splice(index, 1);
    this.saveRecentSearches();
  }

  clearAllRecentSearches(): void {
    this.recentSearches = [];
    localStorage.removeItem('recentTrackingSearches');
    this.showRecentSearches = false;
  }

  private loadRecentSearches(): void {
    const savedSearches = localStorage.getItem('recentTrackingSearches');
    if (savedSearches) {
      try {
        this.recentSearches = JSON.parse(savedSearches);
      } catch (e) {
        console.error('Error parsing recent searches', e);
        this.recentSearches = [];
      }
    }
  }

  private addToRecentSearches(trackingNumber: string): void {
    // Remove if already exists
    const index = this.recentSearches.indexOf(trackingNumber);
    if (index !== -1) {
      this.recentSearches.splice(index, 1);
    }
    
    // Add to the beginning of the array
    this.recentSearches.unshift(trackingNumber);
    
    // Keep only the most recent 5 searches
    if (this.recentSearches.length > 5) {
      this.recentSearches = this.recentSearches.slice(0, 5);
    }
    
    this.saveRecentSearches();
  }

  private saveRecentSearches(): void {
    localStorage.setItem('recentTrackingSearches', JSON.stringify(this.recentSearches));
  }
} 