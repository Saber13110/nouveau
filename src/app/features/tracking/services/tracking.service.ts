import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { TrackingData } from '../models/tracking-data.model';
import { environment } from '../../../../environments/environment';

export interface HistoryItem {
  status: string;
  location: string;
  date: string;
  time: string;
  icon: string;
  state: 'completed' | 'current' | 'pending';
}

export interface PackageInfo {
  weight: string;
  dimensions: string;
  pieces: string;
  insurance: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private transformFedExResponse(resp: any, trackingNumber: string): TrackingData {
    const result = resp?.output?.completeTrackResults?.[0]?.trackResults?.[0] || {};
    const latest = result.latestStatusDetail || {};
    return {
      id: '0',
      trackingNumber,
      status: latest.code || 'UNKNOWN',
      statusDetails: latest.description || '',
      statusDetail: latest.description || '',
      estimatedDeliveryDate: result.dateAndTimes?.[0]?.dateTime || '',
      estimatedDelivery: {
        date: '',
        timeframe: ''
      },
      shipDate: result.shipDate || '',
      shippingDate: result.shipDate || '',
      service: result.serviceDetail?.description || '',
      sender: { name: '', address: '', location: '' },
      recipient: { name: '', address: '', location: '' },
      currentLocation: { address: '' },
      packageInfo: {
        weight: '',
        dimensions: '',
        pieces: '',
        insurance: '',
        items: 0,
        reference: ''
      },
      history: []
    } as TrackingData;
  }

  /**
   * Query the backend to track a shipment by number.
   */
  trackByNumber(trackingNumber: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tracking/number`, { trackingNumber });
  }

  /**
   * Track a shipment by reference number and destination country.
   */
  trackByReference(reference: string, country: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tracking/reference`, { reference, country });
  }

  /**
   * Track a shipment using a Transportation Control Number.
   */
  trackByTCN(tcn: string, shipDate: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tracking/tcn`, { tcn, shipDate });
  }

  /**
   * Track a shipment by scanning a barcode value.
   */
  trackByBarcode(barcode: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tracking/barcode`, { barcode });
  }

  /**
   * Retrieve proof of delivery PDF.
   */
  getProofOfDelivery(trackingNumber: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/tracking/proof/${trackingNumber}`, {
      responseType: 'blob'
    });
  }

  getTrackingData(trackingNumber: string): Observable<TrackingData> {
    if (!trackingNumber || !trackingNumber.trim()) {
      return throwError(() => new Error('Veuillez fournir un numéro de suivi valide'));
    }

    return this.trackByNumber(trackingNumber).pipe(
      map(resp => this.transformFedExResponse(resp, trackingNumber)),
      catchError(() => {
        const mockData: TrackingData = {
          id: '123456',
          trackingNumber: trackingNumber,
          status: 'IN-TRANSIT',
          statusDetails: 'Votre colis est en cours d\'acheminement vers Casablanca, Maroc',
          statusDetail: 'Votre colis est en cours d\'acheminement vers Casablanca, Maroc',
      estimatedDeliveryDate: '2023-06-15',
      estimatedDelivery: {
        date: 'Mercredi, 15 Juin 2023',
        timeframe: 'Avant la fin de la journée'
      },
      shipDate: '2023-06-12',
      shippingDate: '12 Juin 2023',
      service: 'Globex Express International',
      sender: {
        name: 'Globex Express',
        address: 'Paris, France',
        location: 'Paris, France'
      },
      recipient: {
        name: 'Mohammed Alami',
        address: 'Casablanca, Maroc',
        location: 'Casablanca, Maroc'
      },
      currentLocation: {
        address: 'Centre de tri Globex, Casablanca Hub, Maroc'
      },
      packageInfo: {
        weight: '2.5 kg',
        dimensions: '30 x 20 x 15 cm',
        pieces: '3',
        insurance: 'Oui',
        items: 3,
        reference: 'ORD-7890123'
      },
      history: [
        {
          status: 'Shipment Information Received',
          location: 'Casablanca, Maroc',
          date: '12 Juin 2023',
          time: '14:35',
          isCompleted: true
        },
        {
          status: 'Pris en charge par Globex',
          location: 'Paris, France',
          date: '12 Juin 2023',
          time: '16:42',
          isCompleted: true
        },
        {
          status: 'En cours de traitement',
          location: 'Centre de tri Paris, France',
          date: '12 Juin 2023',
          time: '18:23',
          isCompleted: true
        },
        {
          status: 'Départ du centre de tri',
          location: 'Paris, France',
          date: '12 Juin 2023',
          time: '20:15',
          isCompleted: true
        },
        {
          status: 'En transit vers la destination',
          location: 'En vol - Paris à Casablanca',
          date: '13 Juin 2023',
          time: '08:30',
          isCompleted: true
        },
        {
          status: 'Arrivé au centre de tri',
          location: 'Casablanca Hub, Maroc',
          date: '13 Juin 2023',
          time: '15:30',
          isCompleted: true,
          isCurrent: true
        }
      ]
        };

        return of(mockData).pipe(delay(1500));
      })
    );
  }

  // Other methods would be implemented here in a real application
  saveToFavorites(trackingNumber: string): Observable<any> {
    if (!trackingNumber || !trackingNumber.trim()) {
      return throwError(() => new Error('Numéro de suivi invalide'));
    }
    
    // For demo, just return success
    return of({ success: true }).pipe(
      delay(500),
      catchError(error => {
        console.error('Error saving to favorites:', error);
        return throwError(() => new Error('Une erreur est survenue lors de l\'enregistrement dans les favoris'));
      })
    );
  }
  
  updateDeliveryOptions(trackingNumber: string, options: any): Observable<any> {
    if (!trackingNumber || !trackingNumber.trim()) {
      return throwError(() => new Error('Numéro de suivi invalide'));
    }
    
    // For demo, just return success
    return of({ success: true }).pipe(
      delay(500),
      catchError(error => {
        console.error('Error updating delivery options:', error);
        return throwError(() => new Error('Une erreur est survenue lors de la mise à jour des options de livraison'));
      })
    );
  }
} 