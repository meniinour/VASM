// src/app/spst/spst.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { SpstService } from '../services/spst.service';
import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-spst',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarClientComponent, MyHeaderComponent],
  templateUrl: './spst.component.html',
  styleUrl: './spst.component.css',
})
export class SpstComponent implements OnInit {
  // UI state
  sidebarCollapsed = false;
  activeTab = 'info';
  searchQuery = '';
  showNotifications = false;
  showAppointmentModal = false;
  showContactModal = false;
  showMapModal = false;
  isLoadingVisits = false;
  isLoadingDocuments = false;

  // SPST data
  spst: any = {
    name: 'ASTBTP - MARSEILLE-MICHELET',
    address: '35 Bd Michelet, 13008 Marseille',
    phone: '04 91 21 70 00',
    email: 'contact@astbtp13.fr',
    website: 'https://astbtp.fr',
    hours: 'Lun-Ven: 8h30-12h30, 13h30-17h30',
    contacts: [
      { name: 'Dr. DUBOIS', role: 'Médecin du travail', phone: '04 91 21 70 01', email: 'dubois@astbtp13.fr' },
      { name: 'MARTINE LOPEZ', role: 'Assistante médicale', phone: '04 91 21 70 02', email: 'mlopez@astbtp13.fr' }
    ]
  };

  // Data lists
  notifications: Notification[] = [];
  services: Service[] = [];
  visits: Visit[] = [];
  documents: Document[] = [];
  filteredServices: Service[] = [];

  constructor(private spstService: SpstService) {
    this.filteredServices = [...this.services];
  }

  ngOnInit(): void {
    this.loadSPSTData();
    this.loadNotifications();
    this.loadServices();
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

  loadSPSTData(): void {
    // Load SPST information
    this.spstService.getAllSPSTs().subscribe({
      next: (spsts) => {
        if (spsts.length > 0) {
          this.spst = spsts[0]; // Use the first SPST in the list
        }
      },
      error: (error) => {
        console.error('Error loading SPST data:', error);
      }
    });
  }

  loadNotifications(): void {
    this.spstService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        // Fallback to default notifications if API fails
        this.notifications = [
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
      }
    });
  }

  loadServices(): void {
    this.spstService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.filteredServices = [...services];
      },
      error: (error) => {
        console.error('Error loading services:', error);
        // Fallback to default services if API fails
        this.services = [
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
        this.filteredServices = [...this.services];
      }
    });
  }

  loadVisits(): void {
    this.isLoadingVisits = true;

    // In a real app, you would get the employee ID or client ID from the authenticated user
    const employeeId = 1; // Example ID

    this.spstService.getVisits(employeeId).subscribe({
      next: (visits) => {
        this.visits = visits;
        this.isLoadingVisits = false;
      },
      error: (error) => {
        console.error('Error loading visits:', error);
        // Fallback to sample data if API fails
        this.visits = [
          {
            id: 1,
            type: 'Visite médicale périodique',
            date: new Date('2025-06-15T10:30:00'),
            doctor: 'Dr. DUBOIS',
            location: this.spst?.name || 'ASTBTP - MARSEILLE-MICHELET',
            status: 'upcoming',
            icon: 'fas fa-stethoscope'
          },
          {
            id: 2,
            type: 'Examen complémentaire',
            date: new Date('2025-07-05T14:00:00'),
            doctor: 'Dr. BLANC',
            location: this.spst?.name || 'ASTBTP - MARSEILLE-MICHELET',
            status: 'upcoming',
            icon: 'fas fa-heartbeat'
          },
          {
            id: 3,
            type: 'Visite de reprise',
            date: new Date('2025-01-10T09:15:00'),
            doctor: 'Dr. MARTIN',
            location: this.spst?.name || 'ASTBTP - MARSEILLE-MICHELET',
            status: 'completed',
            icon: 'fas fa-user-md'
          }
        ];
        this.isLoadingVisits = false;
      }
    });
  }

  loadDocuments(): void {
    this.isLoadingDocuments = true;

    this.spstService.getDocuments().subscribe({
      next: (documents) => {
        this.documents = documents;
        this.isLoadingDocuments = false;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        // Fallback to sample data if API fails
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
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markNotificationAsRead(notification: any): void {
    this.spstService.markNotificationAsRead(notification.id).subscribe({
      next: () => {
        // Update the notification locally
        notification.read = true;
        // Optionally refresh notifications
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
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

  requestService(service: any): void {
    // In a real app, you would open a modal to collect details
    // For now, we'll use a simple alert
    const details = prompt('Please enter any details for your request:');

    if (details !== null) { // User didn't cancel
      this.spstService.requestService(service.id, { details }).subscribe({
        next: (response) => {
          alert(`Service request for "${service.name}" submitted successfully.`);
        },
        error: (error) => {
          console.error('Error requesting service:', error);
          alert('Error submitting service request. Please try again later.');
        }
      });
    }
  }

  rescheduleVisit(visit: Visit): void {
    // Implement rescheduling logic
    console.log('Reprogrammation de la visite:', visit);
    alert(`Vous allez reprogrammer la visite du ${visit.date.toLocaleDateString()}`);
  }

  downloadDocument(document: any): void {
    this.spstService.downloadDocument(document.id).subscribe({
      next: (blob) => {
        // Create a download link and trigger it
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = document.name + '.' + document.type.toLowerCase();
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        alert(`Error downloading document: ${error.message}`);
      }
    });
  }
}
