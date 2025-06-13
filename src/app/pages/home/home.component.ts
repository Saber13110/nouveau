import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Import Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

interface News {
  id: number;
  title: string;
  content: string;
  image: string;
  imageUrl: string;
  date: Date;
  category: string;
  summary: string;
  slug: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: string;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  image: string;
  link: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  // === Champs du formulaire de tracking
  trackingForm: FormGroup;
  trackingNumber: string = '';

  // === Auth fake pour afficher outils avancés (à remplacer plus tard)
  isLoggedIn = true;

  // === Notifications en file d'attente
  notifications: Notification[] = [];
  currentNotifs: Notification[] = [];

  // === Liste d'actualités
  news: News[] = [];

  // === Liste FAQ
  faqList: FAQ[] = [];

  locations: Location[] = [];

  // === Liste des services
  servicesList: ServiceItem[] = [];
  currentServiceIndex: number = 0;

  selectedLocation: Location | null = null;
  private map: any = null;
  private markers: any[] = [];
  private destroy$ = new Subject<void>();

  // === GESTION DES CARTES DE FONCTIONNALITÉS HERO
  // Tracks the currently selected feature card in the hero section ('barcode_scan', 'obtain_proof', or null for default track by ID)
  selectedHeroFeature: 'barcode_scan' | 'obtain_proof' | null = null;

  // Form for barcode generation
  barcodeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.trackingForm = this.fb.group({
      trackingNumber: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{10,}$')]]
    });
    
    this.barcodeForm = this.fb.group({
      trackingId: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{10,}$')]]
    });
  }

  ngOnInit(): void {
    this.autoPushNotifications();
    this.initializeNews();
    this.initializeLocations();
    this.initializeFAQ();
    this.initializeServices();
    
    // Initialize map after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.initializeMap();
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up map resources
    if (this.map) {
      this.map = null;
    }
    this.markers.forEach(marker => marker.setMap(null));
  }

  private initializeNews(): void {
    this.news = [
      {
        id: 1,
        title: "Nouveau service de livraison express",
        content: "Nous lançons notre nouveau service de livraison express en 24h sur tout le territoire marocain.",
        image: "./assets/images/news/shipping-routes.jpg",
        imageUrl: "./assets/images/news/shipping-routes.jpg",
        date: new Date("2024-03-15"),
        category: "Services",
        summary: "Un nouveau service de livraison express pour une livraison plus rapide...",
        slug: "nouveau-service-express"
      },
      {
        id: 2,
        title: "Expansion de notre réseau de distribution",
        content: "Nous ouvrons 5 nouvelles agences dans les principales villes du Maroc pour mieux vous servir.",
        image: "./assets/images/news/expansion.jpg",
        imageUrl: "./assets/images/news/expansion.jpg",
        date: new Date("2024-03-10"),
        category: "Développement",
        summary: "Nous étendons notre réseau de distribution à de nouvelles villes...",
        slug: "expansion-reseau"
      },
      {
        id: 3,
        title: "Partenariat stratégique avec les leaders du e-commerce",
        content: "Nous renforçons notre présence dans le e-commerce avec de nouveaux partenariats stratégiques.",
        image: "./assets/images/news/partnership.jpg",
        imageUrl: "./assets/images/news/partnership.jpg",
        date: new Date("2024-03-05"),
        category: "Partenariats",
        summary: "Nous annonçons un nouveau partenariat pour améliorer nos services...",
        slug: "partenariat-ecommerce"
      }
    ];
  }

  private initializeLocations(): void {
    this.locations = [
      {
        id: 1,
        name: "Agence Centrale - Casablanca",
        address: "123 Boulevard Hassan II, Casablanca",
        phone: "+212 522-123456",
        email: "casablanca@globex.ma",
        hours: "Lun-Sam: 8h-20h",
        coordinates: { lat: 33.5731, lng: -7.5898 }
      },
      {
        id: 2,
        name: "Agence Rabat",
        address: "45 Avenue Mohammed V, Rabat",
        phone: "+212 537-123456",
        email: "rabat@globex.ma",
        hours: "Lun-Sam: 8h-20h",
        coordinates: { lat: 34.0209, lng: -6.8416 }
      },
      {
        id: 3,
        name: "Agence Marrakech",
        address: "78 Rue Ibn Sina, Marrakech",
        phone: "+212 524-123456",
        email: "marrakech@globex.ma",
        hours: "Lun-Sam: 8h-20h",
        coordinates: { lat: 31.6295, lng: -7.9811 }
      }
    ];
  }

  private initializeFAQ(): void {
    this.faqList = [
      {
        question: "Comment suivre mon colis ?",
        answer: "Entrez votre numéro de suivi dans la barre de recherche en haut de la page pour suivre votre colis en temps réel.",
        isOpen: false
      },
      {
        question: "Quels sont les délais de livraison ?",
        answer: "Les délais de livraison varient selon le service choisi : Express (24h), Standard (2-3 jours), Économique (3-5 jours).",
        isOpen: false
      },
      {
        question: "Comment contacter le service client ?",
        answer: "Notre service client est disponible 24/7 par téléphone au +212 522-123456 ou par email à support@globex.ma.",
        isOpen: false
      }
    ];
  }

  private initializeServices(): void {
    this.servicesList = [
      {
        title: 'Express Delivery',
        description: 'Fast and reliable delivery service for urgent packages',
        image: 'assets/images/services/express-delivery.jpg',
        icon: 'fas fa-truck',
        link: '/services/express'
      },
      {
        title: 'International Shipping',
        description: 'Worldwide shipping solutions for your global needs',
        image: 'assets/images/services/international-shipping.jpg',
        icon: 'fas fa-globe',
        link: '/services/international'
      },
      {
        title: 'Warehousing',
        description: 'Secure storage solutions for your goods',
        image: 'assets/images/services/warehousing.jpg',
        icon: 'fas fa-warehouse',
        link: '/services/warehousing'
      }
    ];
  }

  private initializeMap() {
    if (typeof window.google !== 'undefined') {
      const moroccoCenter = { lat: 31.7917, lng: -7.0926 };
      
      this.map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: moroccoCenter,
        zoom: 6,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }]
          }
        ]
      });

      this.locations.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: location.coordinates,
          map: this.map,
          title: location.name,
          animation: window.google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          this.selectLocation(location);
        });

        this.markers.push(marker);
      });
    }
  }

  selectLocation(location: Location) {
    this.selectedLocation = location;
    
    if (this.map && typeof window.google !== 'undefined') {
      this.map.setCenter(location.coordinates);
      this.map.setZoom(15);

      this.markers.forEach(marker => {
        marker.setAnimation(null);
        if (marker.getTitle() === location.name) {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }
      });
    }
  }

  onSubmit() {
    if (this.trackingForm.valid) {
      const trackingNumber = this.trackingForm.get('trackingNumber')?.value;
      this.router.navigate(['/tracking', trackingNumber]);
    }
  }

  // === TRAITEMENT TRACKING
  trackPackage(): void {
    if (!this.trackingForm.get('trackingNumber')?.value.trim()) return;

    this.addNotification(
      'success',
      'Recherche en cours',
      `Recherche du colis #${this.trackingForm.get('trackingNumber')?.value}...`
    );

    setTimeout(() => {
      // TODO: remplacer par appel vers FastAPI → GET /api/tracking/:id
      this.addNotification(
        'success',
        'Colis trouvé',
        `Colis #${this.trackingForm.get('trackingNumber')?.value} en transit.`
      );

      // Rediriger vers la page résultat
      this.router.navigate(['/tracking/result', this.trackingForm.get('trackingNumber')?.value]);
    }, 2000);
  }

  // === AJOUTER NOTIFICATION FLOTTANTE
  addNotification(type: 'success' | 'warning' | 'error', title: string, message: string): void {
    const notification: Notification = {
      id: Date.now(),
      type,
      title,
      message
    };
    this.notifications.push(notification);
    setTimeout(() => this.removeNotification(notification), 5000);
  }

  // === SUPPRIMER NOTIF
  removeNotification(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }

  // === NOTIFICATIONS AUTO (ex: alerte livraison)
  autoPushNotifications(): void {
    const auto: Array<{type: 'success' | 'warning' | 'error', title: string, message: string}> = [
      {
        type: 'success',
        title: 'Livraison prévue',
        message: 'Votre colis #GBX845 arrivera entre 10h et 13h.'
      },
      {
        type: 'warning',
        title: 'Retard possible',
        message: 'Retard signalé sur le colis #GBX999 (météo).'
      }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < auto.length) {
        this.addNotification(auto[i].type, auto[i].title, auto[i].message);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 8000);
  }

  // === FONCTION POUR FAQ ACCORDÉON
  toggleFaq(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }

  prevService(): void {
    if (this.currentServiceIndex > 0) {
      this.currentServiceIndex--;
    }
  }

  nextService(): void {
    if (this.currentServiceIndex < this.servicesList.length - 1) {
      this.currentServiceIndex++;
    }
  }

  // === SÉLECTIONNER UNE CARTE DE FONCTIONNALITÉ HERO
  selectHeroFeature(feature: 'barcode_scan' | 'obtain_proof' | null): void {
    this.selectedHeroFeature = feature;
    // Logique additionnelle si nécessaire (ex: réinitialiser le formulaire de suivi)
    if (feature === null) {
      // Réinitialiser ou focus sur le formulaire de suivi ID si on revient au défaut
      this.trackingForm.reset();
    }
  }

  // === GESTION DU TÉLÉVERSEMENT DE FICHIER DE CODE-BARRES
  onBarcodeFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Fichier de code-barres sélectionné :', file.name);
      // TODO: Implémenter la logique pour lire l'image et extraire le code-barres
      // Vous aurez besoin d'une bibliothèque de lecture de code-barres (ex: ZXing)
      // et potentiellement d'envoyer l'image ou le code décodé au backend.
    }
  }

  // TODO: Ajouter la logique pour 'Obtain your proof' (saisie ID et bouton télécharger)

  // Method to generate barcode
  generateBarcode(): void {
    if (this.barcodeForm.valid) {
      const trackingId = this.barcodeForm.get('trackingId')?.value;
      // TODO: Implement actual barcode generation logic
      // For now, just show a notification
      this.addNotification(
        'success',
        'Barcode Generated',
        `Barcode for tracking ID ${trackingId} has been generated.`
      );
    } else {
      this.addNotification(
        'error',
        'Invalid Input',
        'Please enter a valid tracking ID (minimum 10 alphanumeric characters).'
      );
    }
  }
}
