import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Shipment {
  trackingNumber: string;
  description: string;
  status: string;
  recipient: string;
  destination: string;
  service: string;
  lastUpdate: string;
  selected?: boolean;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  searchQuery: string = '';
  viewMode: 'list' | 'grid' = 'list';
  showFilters: boolean = false;
  selectedShipments: Set<string> = new Set();
  allSelected: boolean = false;

  shipments: Shipment[] = [
    {
      trackingNumber: '812345678901',
      description: 'Electronics - Laptop Computer',
      status: 'Livré',
      recipient: 'Ahmed Benali',
      destination: 'Casablanca, Morocco',
      service: 'FedEx International Priority',
      lastUpdate: '17/01/2024'
    },
    {
      trackingNumber: '812987654321',
      description: 'Documents - Legal Papers',
      status: 'En transit',
      recipient: 'Fatima Alaoui',
      destination: 'Rabat, Morocco',
      service: 'FedEx International Express',
      lastUpdate: '20/01/2024'
    },
    {
      trackingNumber: '812555777333',
      description: 'Clothing - Winter Collection',
      status: 'En cours de livraison',
      recipient: 'Youssef Tazi',
      destination: 'Marrakech, Morocco',
      service: 'FedEx International Economy',
      lastUpdate: '23/01/2024'
    },
    {
      trackingNumber: '812111222444',
      description: 'Medical Supplies',
      status: 'Exception',
      recipient: 'Dr. Khalid Bennani',
      destination: 'Tangier, Morocco',
      service: 'FedEx International Priority',
      lastUpdate: '20/01/2024'
    },
    {
      trackingNumber: '812666333999',
      description: 'Electronics - Smartphone',
      status: 'En attente',
      recipient: 'Sara Mansouri',
      destination: 'Agadir, Morocco',
      service: 'FedEx International Priority',
      lastUpdate: '17/01/2024'
    },
    {
      trackingNumber: '812444555666',
      description: 'Spare Parts - Automotive',
      status: 'Livré',
      recipient: 'Mohammed Idrissi',
      destination: 'Fes, Morocco',
      service: 'FedEx International Priority',
      lastUpdate: '07/01/2024'
    },
    {
      trackingNumber: '812777888999',
      description: 'Books - Academic',
      status: 'Livré',
      recipient: 'Amina Berrada',
      destination: 'Meknes, Morocco',
      service: 'FedEx International Express',
      lastUpdate: '15/01/2024'
    }
  ];

  filteredShipments: Shipment[] = [];
  totalShipments: number = 0;

  ngOnInit() {
    this.filteredShipments = [...this.shipments];
    this.totalShipments = this.shipments.length;
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredShipments = this.shipments.filter(shipment => 
      shipment.trackingNumber.toLowerCase().includes(query) ||
      shipment.description.toLowerCase().includes(query) ||
      shipment.recipient.toLowerCase().includes(query) ||
      shipment.destination.toLowerCase().includes(query) ||
      shipment.status.toLowerCase().includes(query) ||
      shipment.service.toLowerCase().includes(query)
    );
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleShipmentSelection(trackingNumber: string) {
    if (this.selectedShipments.has(trackingNumber)) {
      this.selectedShipments.delete(trackingNumber);
    } else {
      this.selectedShipments.add(trackingNumber);
    }
    this.updateSelectAllState();
  }

  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedShipments.clear();
    } else {
      this.filteredShipments.forEach(shipment => {
        this.selectedShipments.add(shipment.trackingNumber);
      });
    }
    this.allSelected = !this.allSelected;
  }

  private updateSelectAllState() {
    this.allSelected = this.filteredShipments.every(shipment => 
      this.selectedShipments.has(shipment.trackingNumber)
    );
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'livré':
        return 'fa-check-circle';
      case 'en transit':
        return 'fa-truck';
      case 'en cours de livraison':
        return 'fa-box';
      case 'exception':
        return 'fa-exclamation-circle';
      case 'en attente':
        return 'fa-clock';
      case 'annulé':
        return 'fa-times-circle';
      default:
        return 'fa-question-circle';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  // Stats methods
  get stats() {
    const total = this.shipments.length;
    const delivered = this.shipments.filter(s => s.status === 'Livré').length;
    const inTransit = this.shipments.filter(s => s.status === 'En transit').length;
    const pending = this.shipments.filter(s => s.status === 'En attente').length;
    const exceptions = this.shipments.filter(s => s.status === 'Exception').length;

    return {
      total,
      delivered,
      inTransit,
      pending,
      exceptions,
      avgDeliveryDays: 2.0 // Exemple statique
    };
  }

  addShipment() {
    // Implémenter la logique d'ajout
    console.log('Ajouter un nouvel envoi');
  }

  // Export des données
  exportData(format: 'pdf' | 'csv' | 'excel'): void {
    const selectedData = this.filteredShipments.filter(
      shipment => this.selectedShipments.has(shipment.trackingNumber)
    );
    console.log(`Exporter les données en ${format}`, selectedData);
  }
} 