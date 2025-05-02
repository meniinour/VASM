import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../my-header/my-header.component';

interface Notification {
  id: number;
  message: string;
  date: Date;
  icon: string;
  read: boolean;
}

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface Visit {
  id: number;
  type: string;
  date: Date;
  doctor: string;
  location: string;
  status: 'upcoming' | 'completed';
  icon: string;
}

interface Document {
  id: number;
  name: string;
  date: Date;
  type: string;
  fileUrl: string;
  icon: string;
}

@Component({
  selector: 'app-spst',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarClientComponent, MyHeaderComponent],
  templateUrl: './spst.component.html',
  styleUrls: ['./spst.component.css']
})
export class SpstComponent implements OnInit {
  sidebarCollapsed = false;
  activeTab = 'info';
  searchQuery = '';
  showNotifications = false;
  showAppointmentModal = false;
  showContactModal = false;
  showMapModal = false;
  isLoadingVisits = false;
  isLoadingDocuments = false;

  notifications: Notification[] = [
    {
      id: 1,
      message: 'Votre visite médicale est programmée pour le 15/06/2025',
      date: new Date('2025-05-01'),
      icon: 'fas fa-calendar-check',
      read: false
    },
    {
      id: 2,
      message: 'Nouveau document disponible : Attestation de suivi',
      date: new Date('2025-04-28'),
      icon: 'fas fa-file-medical',
      read: false
    },
    {
      id: 3,
      message: 'Rappel : Questionnaire de santé à compléter avant le 10/05/2025',
      date: new Date('2025-04-25'),
      icon: 'fas fa-clipboard-list',
      read: false
    }
  ];

  services: Service[] = [
    {
      id: 1,
      name: 'Visite médicale périodique',
      description: 'Suivi médical obligatoire pour tous les salariés',
      icon: 'fas fa-user-md'
    },
    {
      id: 2,
      name: 'Ergonomie du poste de travail',
      description: 'Évaluation et conseils pour améliorer votre espace de travail',
      icon: 'fas fa-chair'
    },
    {
      id: 3,
      name: 'Prévention des risques professionnels',
      description: 'Identification et gestion des risques liés à votre activité',
      icon: 'fas fa-hard-hat'
    },
    {
      id: 4,
      name: 'Conseil en hygiène et sécurité',
      description: 'Recommandations pour améliorer les conditions de travail',
      icon: 'fas fa-shield-alt'
    },
    {
      id: 5,
      name: 'Vaccination professionnelle',
      description: 'Services de vaccination liés aux risques professionnels',
      icon: 'fas fa-syringe'
    },
    {
      id: 6,
      name: 'Soutien psychologique',
      description: 'Accompagnement pour les problématiques de stress et bien-être au travail',
      icon: 'fas fa-brain'
    }
  ];

  visits: Visit[] = [];
  documents: Document[] = [];
  filteredServices: Service[] = [];

  constructor() {
    this.filteredServices = [...this.services];
  }

  ngOnInit(): void {
    this.loadVisits();
    this.loadDocuments();
  }

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'visits' && this.visits.length === 0) {
      this.loadVisits();
    } else if (tab === 'documents' && this.documents.length === 0) {
      this.loadDocuments();
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  openAppointmentModal(): void {
    this.showAppointmentModal = true;
  }

  openContactModal(): void {
    this.showContactModal = true;
  }

  openLocationMap(): void {
    this.showMapModal = true;
  }

  openSpstPortal(): void {
    window.open('https://astbtp.fr/portail', '_blank');
  }

  searchServices(): void {
    if (!this.searchQuery.trim()) {
      this.filteredServices = [...this.services];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredServices = this.services.filter(service => 
      service.name.toLowerCase().includes(query) || 
      service.description.toLowerCase().includes(query)
    );
  }

  requestService(service: Service): void {
    // Logique pour demander un service
    console.log('Service demandé:', service);
    alert(`Vous avez demandé plus d'informations sur: ${service.name}`);
  }

  loadVisits(): void {
    this.isLoadingVisits = true;
    
    // Simuler un chargement depuis une API
    setTimeout(() => {
      this.visits = [
        {
          id: 1,
          type: 'Visite médicale périodique',
          date: new Date('2025-06-15T10:30:00'),
          doctor: 'Dr. DUBOIS',
          location: 'ASTBTP - MARSEILLE-MICHELET',
          status: 'upcoming',
          icon: 'fas fa-stethoscope'
        },
        {
          id: 2,
          type: 'Examen complémentaire',
          date: new Date('2025-07-05T14:00:00'),
          doctor: 'Dr. BLANC',
          location: 'ASTBTP - MARSEILLE-MICHELET',
          status: 'upcoming',
          icon: 'fas fa-heartbeat'
        },
        {
          id: 3,
          type: 'Visite de reprise',
          date: new Date('2025-01-10T09:15:00'),
          doctor: 'Dr. MARTIN',
          location: 'ASTBTP - MARSEILLE-MICHELET',
          status: 'completed',
          icon: 'fas fa-user-md'
        }
      ];
      
      this.isLoadingVisits = false;
    }, 1000);
  }

  loadDocuments(): void {
    this.isLoadingDocuments = true;
    
    // Simuler un chargement depuis une API
    setTimeout(() => {
      this.documents = [
        {
          id: 1,
          name: 'Attestation de suivi',
          date: new Date('2025-04-28'),
          type: 'PDF',
          fileUrl: '/assets/docs/attestation.pdf',
          icon: 'fas fa-file-pdf'
        },
        {
          id: 2,
          name: 'Rapport d\'aptitude',
          date: new Date('2025-01-10'),
          type: 'PDF',
          fileUrl: '/assets/docs/rapport.pdf',
          icon: 'fas fa-file-medical'
        },
        {
          id: 3,
          name: 'Résultats d\'analyses',
          date: new Date('2024-11-15'),
          type: 'PDF',
          fileUrl: '/assets/docs/analyses.pdf',
          icon: 'fas fa-file-medical-alt'
        },
        {
          id: 4,
          name: 'Recommandations ergonomiques',
          date: new Date('2024-09-22'),
          type: 'PDF',
          fileUrl: '/assets/docs/ergonomie.pdf',
          icon: 'fas fa-file-alt'
        }
      ];
      
      this.isLoadingDocuments = false;
    }, 1200);
  }

  rescheduleVisit(visit: Visit): void {
    // Logique pour reprogrammer une visite
    console.log('Reprogrammation de la visite:', visit);
    alert(`Vous allez reprogrammer la visite du ${visit.date.toLocaleDateString()}`);
  }

  downloadDocument(document: Document): void {
    // Logique pour télécharger un document
    console.log('Téléchargement du document:', document);
    alert(`Téléchargement du document: ${document.name}`);
  }
}