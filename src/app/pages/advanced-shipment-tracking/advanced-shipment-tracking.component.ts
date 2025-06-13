import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Shipment {
  id: number;
  tracking: string;
  status: 'delivered' | 'in-transit' | 'exception' | 'pending';
  deliveryDate: string;
  deliveryTime: string;
  shipper: string;
  destination: string;
  reference: string;
  weight: string;
  service: string;
}

@Component({
  selector: 'app-advanced-shipment-tracking',
  templateUrl: './advanced-shipment-tracking.component.html',
  styleUrls: ['./advanced-shipment-tracking.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdvancedShipmentTrackingComponent implements OnInit {
  currentView = 'all';
  sortOrder: { [key: string]: 'asc' | 'desc' | 'none' } = { status: 'asc' };
  filteredData: Shipment[] = [];
  allShipments: Shipment[] = [];
  selectedShipments = new Set<number>();
  currentPage = 1;
  itemsPerPage = 10;
  showFilters = false;
  showGlobalSearch = false;
  showSettings = false;
  showShipmentDetails = false;
  selectedShipment: Shipment | null = null;

  // Sample data
  private sampleShipments: Shipment[] = [
    {
      id: 1,
      tracking: 'GBX123456789',
      status: 'delivered',
      deliveryDate: '2025-05-25',
      deliveryTime: '14:30',
      shipper: 'Tech Solutions Inc',
      destination: 'Paris, France',
      reference: 'REF001',
      weight: '2.5 kg',
      service: 'Express'
    },
    {
      id: 2,
      tracking: 'GBX987654321',
      status: 'in-transit',
      deliveryDate: '2025-05-27',
      deliveryTime: '16:00',
      shipper: 'Global Trade Corp',
      destination: 'Madrid, Spain',
      reference: 'REF002',
      weight: '1.8 kg',
      service: 'Standard'
    },
    {
      id: 3,
      tracking: 'GBX456789123',
      status: 'exception',
      deliveryDate: '2025-05-26',
      deliveryTime: '10:00',
      shipper: 'Express Logistics',
      destination: 'Berlin, Germany',
      reference: 'REF003',
      weight: '3.2 kg',
      service: 'Priority'
    },
    {
      id: 4,
      tracking: 'GBX789123456',
      status: 'delivered',
      deliveryDate: '2025-05-24',
      deliveryTime: '09:15',
      shipper: 'International Shipping',
      destination: 'Rome, Italy',
      reference: 'REF004',
      weight: '0.9 kg',
      service: 'Express'
    },
    {
      id: 5,
      tracking: 'GBX321654987',
      status: 'pending',
      deliveryDate: '2025-05-28',
      deliveryTime: '11:45',
      shipper: 'Quick Delivery',
      destination: 'Amsterdam, Netherlands',
      reference: 'REF005',
      weight: '4.1 kg',
      service: 'Standard'
    }
  ];

  // Filter form data
  filterForm = {
    tracking: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    shipper: '',
    destination: ''
  };

  constructor() {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.allShipments = [...this.sampleShipments];
    this.filteredData = [...this.allShipments];
    this.updateStats();
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'delivered': 'fas fa-check-circle',
      'in-transit': 'fas fa-truck',
      'exception': 'fas fa-exclamation-triangle',
      'pending': 'fas fa-tag'
    };
    return icons[status] || 'fas fa-circle';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'delivered': 'Delivered',
      'in-transit': 'In Transit',
      'exception': 'Exception',
      'pending': 'Label Created'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  updateStats(): void {
    // The stats are now automatically updated through the computed properties
    // No need for additional implementation
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    this.filteredData = this.allShipments.filter(shipment => {
      if (this.filterForm.tracking && !shipment.tracking.toLowerCase().includes(this.filterForm.tracking.toLowerCase())) return false;
      if (this.filterForm.status && shipment.status !== this.filterForm.status) return false;
      if (this.filterForm.shipper && !shipment.shipper.toLowerCase().includes(this.filterForm.shipper.toLowerCase())) return false;
      if (this.filterForm.destination && !shipment.destination.toLowerCase().includes(this.filterForm.destination.toLowerCase())) return false;
      
      if (this.filterForm.dateFrom) {
        const shipmentDate = new Date(shipment.deliveryDate);
        const filterDate = new Date(this.filterForm.dateFrom);
        if (shipmentDate < filterDate) return false;
      }
      
      if (this.filterForm.dateTo) {
        const shipmentDate = new Date(shipment.deliveryDate);
        const filterDate = new Date(this.filterForm.dateTo);
        if (shipmentDate > filterDate) return false;
      }
      
      return true;
    });
  }

  clearFilters(): void {
    this.filterForm = {
      tracking: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      shipper: '',
      destination: ''
    };
    this.filteredData = [...this.allShipments];
  }

  toggleShipmentSelection(shipmentId: number): void {
    if (this.selectedShipments.has(shipmentId)) {
      this.selectedShipments.delete(shipmentId);
    } else {
      this.selectedShipments.add(shipmentId);
    }
  }

  viewShipmentDetails(shipment: Shipment): void {
    this.selectedShipment = shipment;
    this.showShipmentDetails = true;
  }

  closeShipmentDetails(): void {
    this.showShipmentDetails = false;
    this.selectedShipment = null;
  }

  exportData(format: string): void {
    // Implementation for exporting data
    console.log(`Exporting data as ${format}`);
  }

  sortTable(column: string): void {
    const currentOrder = this.sortOrder[column] || 'none';
    let newOrder: 'asc' | 'desc' | 'none';

    switch(currentOrder) {
      case 'none':
        newOrder = 'asc';
        break;
      case 'asc':
        newOrder = 'desc';
        break;
      case 'desc':
        newOrder = 'none';
        break;
      default:
        newOrder = 'none';
    }

    this.sortOrder[column] = newOrder;

    if (newOrder !== 'none') {
      this.filteredData.sort((a, b) => {
        let aVal = a[column as keyof Shipment];
        let bVal = b[column as keyof Shipment];

        if (aVal < bVal) return newOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return newOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  // Add computed properties for filtered counts
  get exceptionCount(): number {
    return this.filteredData.filter(s => s.status === 'exception').length;
  }

  get pendingCount(): number {
    return this.filteredData.filter(s => s.status === 'pending').length;
  }

  get deliveredCount(): number {
    return this.filteredData.filter(s => s.status === 'delivered').length;
  }
} 