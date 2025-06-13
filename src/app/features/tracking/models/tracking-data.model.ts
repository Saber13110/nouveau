export interface TrackingData {
  id: string;
  trackingNumber: string;
  status: string;
  statusDetails: string;
  statusDetail: string; // Pour la compatibilité avec le template
  estimatedDeliveryDate: string;
  estimatedDelivery: {
    date: string;
    timeframe: string;
  };
  shipDate: string;
  shippingDate: string; // Pour la compatibilité avec le template
  service: string;
  sender: {
    name: string;
    address: string;
    location: string; // Pour la compatibilité avec le template
  };
  recipient: {
    name: string;
    address: string;
    location: string; // Pour la compatibilité avec le template
  };
  currentLocation: {
    address: string;
  };
  packageInfo: {
    weight: string;
    dimensions: string;
    pieces: string;
    insurance: string;
    items: number; // Pour la compatibilité avec le template
    reference: string; // Pour la compatibilité avec le template
  };
  history: Array<{
    status: string;
    location: string;
    date: string;
    time: string;
    isCompleted: boolean;
    isCurrent?: boolean;
  }>;
} 