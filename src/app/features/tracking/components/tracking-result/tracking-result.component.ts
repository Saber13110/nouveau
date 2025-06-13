import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgFor, NgStyle } from '@angular/common';
import { TrackingData } from '../../models/tracking-data.model';
import { TrackingService } from '../../services/tracking.service';

// Declare Leaflet to avoid TypeScript errors
declare const L: any;

@Component({
  selector: 'app-tracking-result',
  templateUrl: './tracking-result.component.html',
  styleUrls: ['./tracking-result.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgClass,
    NgIf,
    NgFor,
    NgStyle
  ]
})
export class TrackingResultComponent implements OnInit, AfterViewInit {
  @Input() trackingNumber: string = '';
  @Output() retrySearch = new EventEmitter<string>();

  trackingData: TrackingData | null = null;
  isLoading: boolean = true;
  loading: boolean = true;
  error: boolean = false;
  errorMessage: string | null = null;
  showNotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  
  // Map variables
  map: any;
  marker: any;
  packagePath: any[] = [];
  currentPosition: [number, number] = [31.7917, -7.0926]; // Morocco center coordinates
  
  // Modals visibility states
  showScheduleModal: boolean = false;
  showAddressModal: boolean = false;
  showLocationModal: boolean = false;
  showInstructionsModal: boolean = false;
  
  // Dropdown states
  showShareDropdown: boolean = false;
  showSaveDropdown: boolean = false;
  
  // Form models
  scheduleForm = {
    date: '',
    timeWindow: '',
    notes: ''
  };
  
  addressForm = {
    name: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: 'MA',
    phone: ''
  };
  
  locationForm = {
    search: '',
    selectedId: ''
  };
  
  instructionsForm = {
    type: 'leave-at-door',
    accessCode: '',
    details: ''
  };
  
  // Sample location results (would come from API in real implementation)
  locationResults = [
    {
      id: 'loc1',
      name: 'Globex Shipping Center - Downtown',
      address: '123 Main St, Casablanca',
      hours: 'Mon-Fri: 8AM-8PM, Sat: 9AM-5PM',
      distance: 2.4
    },
    {
      id: 'loc2',
      name: 'Globex Pickup Point - Marina',
      address: '456 Marina Blvd, Casablanca',
      hours: 'Mon-Sat: 9AM-9PM, Sun: 10AM-4PM',
      distance: 3.7
    },
    {
      id: 'loc3',
      name: 'Globex Partner Store - Maarif',
      address: '789 Zerktouni Blvd, Casablanca',
      hours: 'Mon-Sun: 8AM-10PM',
      distance: 5.1
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private trackingService: TrackingService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['number']) {
        this.trackingNumber = params['number'];
        this.loadTrackingData();
      }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.action-dropdown')) {
        this.showShareDropdown = false;
        this.showSaveDropdown = false;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 1000);
  }

  initMap(): void {
    // Get the map container element
    const mapElement = document.getElementById('tracking-map');
    if (!mapElement) return;

    // Create map
    this.map = L.map('tracking-map').setView(this.currentPosition, 6);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add package marker with custom icon
    const packageIcon = L.icon({
      iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });

    // Add a marker for the current position
    this.marker = L.marker(this.currentPosition, { icon: packageIcon })
      .addTo(this.map)
      .bindPopup('Votre colis est ici')
      .openPopup();

    // Simulate package movement when data is loaded
    if (this.trackingData) {
      this.simulatePackageMovement();
    }
  }

  simulatePackageMovement(): void {
    // Sample coordinates for Casablanca to Rabat
    const route = [
      [33.5731, -7.5898], // Casablanca
      [33.6844, -7.3894], // Mohammedia
      [34.0209, -6.8416]  // Rabat
    ];

    // Add route line
    const routeLine = L.polyline(route, { color: '#4d148c', weight: 4 }).addTo(this.map);
    
    // Fit map to route
    this.map.fitBounds(routeLine.getBounds());

    // Update marker position based on status
    if (this.trackingData && this.trackingData.status === 'in-transit') {
      // Set marker to the middle point of the route
      this.marker.setLatLng(route[1]);
      this.marker.setPopupContent('Votre colis est en transit');
    } else if (this.trackingData && this.trackingData.status === 'delivered') {
      // Set marker to the destination
      this.marker.setLatLng(route[2]);
      this.marker.setPopupContent('Votre colis a été livré');
    }
  }

  loadTrackingData(): void {
    this.loading = true;
    this.isLoading = true;
    this.error = false;
    
    this.trackingService.getTrackingData(this.trackingNumber)
      .subscribe({
        next: (data: TrackingData) => {
          this.trackingData = data;
          this.isLoading = false;
          this.loading = false;
          
          // Pre-fill address form with current delivery address
          if (this.trackingData && this.trackingData.recipient) {
            this.addressForm.name = this.trackingData.recipient.name;
            // Additional address parsing would happen here
          }

          // Update map if it's already initialized
          if (this.map) {
            this.simulatePackageMovement();
          }
        },
        error: (err: Error) => {
          this.error = true;
          this.errorMessage = 'Numéro de suivi invalide ou introuvable';
          this.isLoading = false;
          this.loading = false;
          console.error('Error fetching tracking data:', err);
        }
      });
  }
  
  // ==== DROPDOWN TOGGLES ====
  toggleShareDropdown(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.showShareDropdown = !this.showShareDropdown;
    this.showSaveDropdown = false;
  }
  
  toggleSaveDropdown(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.showSaveDropdown = !this.showSaveDropdown;
    this.showShareDropdown = false;
  }
  
  // ==== SHARING METHODS ====
  copyToClipboard(): void {
    const trackingLink = `${window.location.origin}/tracking/${this.trackingNumber}`;
    navigator.clipboard.writeText(trackingLink).then(() => {
      alert('Tracking link copied to clipboard!');
      this.showShareDropdown = false;
    });
  }
  
  shareViaEmail(): void {
    const subject = `Suivi de colis ${this.trackingNumber}`;
    const body = `Suivez votre colis Globex Express: ${this.trackingNumber}\n\nStatut actuel: ${this.trackingData?.status}\n\nSuivez votre colis: https://globex-express.com/track?number=${this.trackingNumber}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    this.showShareDropdown = false;
  }
  
  shareViaSMS(): void {
    const text = `Suivez votre colis Globex Express: ${this.trackingNumber}. Statut actuel: ${this.trackingData?.status}. https://globex-express.com/track?number=${this.trackingNumber}`;
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
    this.showShareDropdown = false;
  }
  
  shareViaWhatsapp(): void {
    const text = `Suivez votre colis Globex Express: ${this.trackingNumber}. Statut actuel: ${this.trackingData?.status}. https://globex-express.com/track?number=${this.trackingNumber}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    this.showShareDropdown = false;
  }
  
  // ==== PRINT/SAVE METHODS ====
  printTracking(): void {
    window.print();
  }
  
  saveTracking(): void {
    // Save to favorites logic (would store in local storage or user account)
    localStorage.setItem(`favorite_tracking_${this.trackingNumber}`, JSON.stringify({
      number: this.trackingNumber,
      savedAt: new Date().toISOString(),
      status: this.trackingData?.status,
      recipient: this.trackingData?.recipient?.name
    }));
    
    alert('Tracking saved to favorites!');
    this.showSaveDropdown = false;
  }
  
  downloadAsPDF(): void {
    this.showSaveDropdown = false;
    alert('PDF download functionality would be implemented here.\n\nPlease install file-saver package to enable this feature.');
  }
  
  downloadAsExcel(): void {
    this.showSaveDropdown = false;
    alert('Excel download functionality would be implemented here.\n\nPlease install xlsx package to enable this feature.');
  }
  
  // ==== MODAL METHODS ====
  openDeliveryScheduleModal(): void {
    this.showScheduleModal = true;
  }
  
  openAddressChangeModal(): void {
    this.showAddressModal = true;
  }
  
  openHoldLocationModal(): void {
    this.showLocationModal = true;
  }
  
  openInstructionsModal(): void {
    this.showInstructionsModal = true;
  }
  
  closeAllModals(): void {
    this.showScheduleModal = false;
    this.showAddressModal = false;
    this.showLocationModal = false;
    this.showInstructionsModal = false;
  }
  
  // ==== FORM SUBMISSION METHODS ====
  saveScheduleDelivery(): void {
    // This would call an API endpoint to update delivery schedule
    console.log('Schedule data to submit:', this.scheduleForm);
    
    // Simulate API call
    setTimeout(() => {
      alert('Delivery has been scheduled successfully!');
      this.closeAllModals();
      this.loadTrackingData(); // Refresh tracking data
    }, 1000);
  }
  
  saveAddressChange(): void {
    // Validate form
    if (!this.addressForm.name || !this.addressForm.line1 || !this.addressForm.city || !this.addressForm.postalCode) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Address data to submit:', this.addressForm);
    
    // Simulate API call
    setTimeout(() => {
      alert('Delivery address has been updated successfully!');
      this.closeAllModals();
      this.loadTrackingData(); // Refresh tracking data
    }, 1000);
  }
  
  saveHoldLocation(): void {
    if (!this.locationForm.selectedId) {
      alert('Please select a location');
      return;
    }
    
    console.log('Location data to submit:', this.locationForm);
    
    // Simulate API call
    setTimeout(() => {
      alert('Package will be held at the selected location');
      this.closeAllModals();
      this.loadTrackingData(); // Refresh tracking data
    }, 1000);
  }
  
  saveDeliveryInstructions(): void {
    console.log('Instructions data to submit:', this.instructionsForm);
    
    // Simulate API call
    setTimeout(() => {
      alert('Delivery instructions have been saved');
      this.closeAllModals();
      this.loadTrackingData(); // Refresh tracking data
    }, 1000);
  }
  
  searchLocations(): void {
    // This would call an API to search for locations
    console.log('Searching for locations with term:', this.locationForm.search);
    
    // For demo, we're just using the static list
    // In a real app, this would filter from an API response
  }
  
  selectLocation(locationId: string): void {
    this.locationForm.selectedId = locationId;
  }
  
  // ==== ADDITIONAL SERVICES ====
  requestProofOfDelivery(): void {
    // API call to request proof of delivery
    alert('La preuve de livraison serait affichée ici');
  }
  
  openCustomsClearanceInfo(): void {
    // This would typically open a modal or navigate to customs info page
    alert('Customs clearance information would display here');
  }

  retry(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = null;
    if (this.trackingNumber) {
      this.retrySearch.emit(this.trackingNumber);
    }
  }

  // Status helpers
  getStatusClass(): string {
    const status = this.trackingData?.status?.toLowerCase();
    if (status === 'delivered') return 'delivered';
    if (status === 'in-transit' || status === 'in transit') return 'in-transit';
    if (status === 'out-for-delivery' || status === 'out for delivery') return 'out-for-delivery';
    return 'in-transit';
  }

  getStatusIcon(): string {
    const status = this.trackingData?.status?.toLowerCase();
    if (status === 'delivered') return 'fas fa-check-circle';
    if (status === 'in-transit' || status === 'in transit') return 'fas fa-truck';
    if (status === 'out-for-delivery' || status === 'out for delivery') return 'fas fa-truck-loading';
    return 'fas fa-shipping-fast';
  }

  getStatusMessage(): string {
    const status = this.trackingData?.status?.toLowerCase() || '';
    if (status === 'delivered') return 'Votre colis a été livré';
    if (status === 'in-transit' || status === 'in transit') return 'Votre colis est en transit';
    if (status === 'out-for-delivery' || status === 'out for delivery') return 'Votre colis est en cours de livraison';
    return 'Votre colis est en traitement';
  }

  // Progress bar helpers
  getProgressPercentage(): number {
    const status = this.trackingData?.status?.toLowerCase() || '';
    if (status === 'delivered') return 100;
    if (status === 'out-for-delivery' || status === 'out for delivery') return 75;
    if (status === 'in-transit' || status === 'in transit') return 50;
    return 25; // Shipped
  }

  isStepCompleted(step: string): boolean {
    const status = this.trackingData?.status?.toLowerCase() || '';
    if (step === 'shipped') return true; // Always completed if we have tracking data
    if (step === 'inTransit') {
      return ['in-transit', 'in transit', 'out-for-delivery', 'out for delivery', 'delivered'].includes(status);
    }
    if (step === 'outForDelivery') {
      return ['out-for-delivery', 'out for delivery', 'delivered'].includes(status);
    }
    if (step === 'delivered') {
      return status === 'delivered';
    }
    return false;
  }

  isStepActive(step: string): boolean {
    const status = this.trackingData?.status?.toLowerCase() || '';
    if (step === 'inTransit') {
      return status === 'in-transit' || status === 'in transit';
    }
    if (step === 'outForDelivery') {
      return status === 'out-for-delivery' || status === 'out for delivery';
    }
    if (step === 'delivered') {
      return status === 'delivered';
    }
    return false;
  }

  // Timeline event helpers
  getEventStatusClass(event: any): string {
    if (event.isCurrent) return 'current';
    if (event.isCompleted) return 'completed';
    return 'pending';
  }

  getEventStatusIcon(event: any): string {
    if (event.status.toLowerCase().includes('livré')) return 'fas fa-check-circle';
    if (event.status.toLowerCase().includes('transit')) return 'fas fa-truck';
    if (event.status.toLowerCase().includes('livraison')) return 'fas fa-truck-loading';
    if (event.status.toLowerCase().includes('arrivé')) return 'fas fa-warehouse';
    if (event.status.toLowerCase().includes('départ')) return 'fas fa-route';
    if (event.status.toLowerCase().includes('traitement')) return 'fas fa-cogs';
    if (event.status.toLowerCase().includes('pris en charge')) return 'fas fa-hands';
    if (event.status.toLowerCase().includes('information')) return 'fas fa-info-circle';
    return 'fas fa-box';
  }

  // Action handlers
  copyTrackingLink(): void {
    navigator.clipboard.writeText(`https://globex-express.com/track?number=${this.trackingData?.trackingNumber || this.trackingNumber}`);
    this.showShareDropdown = false;
  }

  openNotification(title: string, message: string): void {
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.closeNotification();
    }, 3000);
  }

  closeNotification(): void {
    this.showNotification = false;
    this.notificationTitle = '';
    this.notificationMessage = '';
  }

  getMinDeliveryDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
