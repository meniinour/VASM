import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import clientsData from '../../assets/data/clients.json'; // Assuming path to your clients.json

interface Client {
  id: number;
  name: string;
  logo: string;
  indicators: {
    mouvements: number;
    joursRetards: number;
    etablissementsInconnus: number;
    programmees?: number;
    suspendues?: number;
    sensibles?: number;
    sansAS?: number;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    website: string;
    person: string;
    city?: string;
    assistant?: string;
  };
  meetings: any[];
  visits: any[];
  employees: any[];
}

interface Employee {
  id: number;
  name: string;
  gender: string;
  birthdate: string;
  contractType: string;
  startDate: string;
  spst: string;
  role: string;
  surveillance: string;
  pcsCode: string;
}

interface SPST {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  url: string;
  message: string;
}

interface Visit {
  id: number;
  type: string;
  etat: string;
  envisagee: string;
  effectuee?: string;
  suivi: string;
  apte: boolean;
}

interface RendezVous {
  id: number;
  date: string;
  envoi: string;
  ar: boolean;
  ordonnance: boolean;
  accepte: boolean;
  excusable: boolean;
  reporte: boolean;
  honore: boolean;
  motif?: string;
  commentaire?: string;
}

@Component({
  selector: 'app-client-assign',
  standalone: true,
  imports: [CommonModule, SidebarClientComponent, MyHeaderComponent, ReactiveFormsModule],
  templateUrl: './client-assign.component.html',
  styleUrls: ['./client-assign.component.css']
})
export class ClientAssignComponent implements OnInit {
  // UI state
  sidebarCollapsed = false;
  activeTab: string = 'tab1';
  
  // Data
  client: Client | undefined;
  employee: Employee | undefined;
  spst: SPST | undefined;
  contact: any = {};
  visites: Visit[] = [];
  rendezVous: RendezVous[] = [];
  
  // Filters and sorting
  filterCriteria: any = {};
  sortCriteria: { table: string, field: string, direction: 'asc' | 'desc' } | null = null;
  
  // Indicators
  indicators = {
    programmees: 145,
    suspendues: 73,
    sensibles: 12,
    sansAS: 13
  };
  
  // Employee navigation
  currentEmployeeIndex: number = 0;
  totalEmployees: number = 0;
  
  // Filter options
  etablissements: string[] = ['ASTBTP13 Marseille', 'ASTBTP69 Lyon', 'ASTBTP75 Paris'];
  assistants: string[] = ['MATTONE SABRINA', 'DUPONT JEAN', 'MARTIN SOPHIE'];
  
  // Modal state
  showAppointmentModal = false;
  showVisitModal = false;
  showConfirmationModal = false;
  showIncidentModal = false;
  isEditingRdv = false;
  isEditingVisite = false;
  confirmationMessage = '';
  confirmationCallback: (() => void) | null = null;
  
  // Toast notification
  showToast = false;
  toastMessage = '';
  toastType: string | undefined;
  
  // Forms
  appointmentForm: FormGroup;
  visitForm: FormGroup;
  incidentForm: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize forms
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      envoi: ['', Validators.required],
      ar: [false],
      ordonnance: [false],
      accepte: [false],
      excusable: [false],
      reporte: [false],
      honore: [false],
      motif: [''],
      commentaire: ['']
    });
    
    this.visitForm = this.fb.group({
      type: ['VIPP', Validators.required],
      etat: ['Programmée', Validators.required],
      envisagee: ['', Validators.required],
      effectuee: [''],
      suivi: ['SIR B', Validators.required],
      apte: [false]
    });
    
    this.incidentForm = this.fb.group({
      type: ['', Validators.required],
      severity: ['medium', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Fetch client ID from route parameters
    this.route.params.subscribe(params => {
      const clientId = Number(params['id']);
      // Load client data based on the client ID
      this.loadClient(clientId);
    });
    
    // Sample data for demo purpose
    this.visites = [
      {
        id: 1,
        type: 'VIPP',
        etat: 'Programmée',
        envisagee: '17/04/2025',
        suivi: 'SIR B',
        apte: false
      },
      {
        id: 2,
        type: 'VIPP',
        etat: 'Effectuée',
        envisagee: '30/06/2025',
        effectuee: '30/06/2025',
        suivi: 'SIR B',
        apte: false
      },
      {
        id: 3,
        type: 'VIPI',
        etat: 'Effectuée',
        envisagee: '04/02/2024',
        effectuee: '04/07/2023',
        suivi: 'SIR B',
        apte: true
      }
    ];
    
    this.rendezVous = [
      {
        id: 1,
        date: '04/03/2025 15:40',
        envoi: '28/02/2025',
        ar: false,
        ordonnance: false,
        accepte: false,
        excusable: false,
        reporte: false,
        honore: false
      }
    ];
  }
  
  loadClient(clientId: number): void {
    // Find client in JSON data
    this.client = clientsData.find(client => client.id === clientId);
    
    if (this.client) {
      // Set indicators from client data if available
      if (this.client.indicators) {
        this.indicators = {
          ...this.indicators,
          ...this.client.indicators
        };
      }
      
      // Set employee data (first employee for demo)
      if (this.client.employees && this.client.employees.length > 0) {
        this.employee = this.client.employees[0] as unknown as Employee;
        this.currentEmployeeIndex = 1;
        this.totalEmployees = this.client.employees.length;
      }
      
      // Set contact info
      if (this.client.contact) {
        this.contact = this.client.contact;
      }
      
      // Set visits and appointments if available
      if (this.client.visits && this.client.visits.length > 0) {
        this.visites = this.client.visits;
      }
      
      if (this.client.meetings && this.client.meetings.length > 0) {
        this.rendezVous = this.client.meetings;
      }
    }
  }
  
  // Sidebar toggle handler
  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
  
  // Filter handling
  onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    const name = select.options[0].text;
    
    if (value) {
      this.filterCriteria[name] = value;
    } else {
      delete this.filterCriteria[name];
    }
  }
  
  applyFilters(): void {
    // Apply filters to visites and rdv
    this.showToastMessage('Filtres appliqués', 'info');
    
    // Here you would typically call an API or filter local data
    console.log('Applying filters:', this.filterCriteria);
  }
  
  showToastMessage(message: string, p0: string): void {
    this.toastMessage = message;
    this.showToast = true;
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  clearFilters(): void {
    this.filterCriteria = {};
    // Reset all select elements to their first option
    const selects = document.querySelectorAll('.filters select');
    selects.forEach((select: Element) => {
      (select as HTMLSelectElement).selectedIndex = 0;
    });
    
    // Reset filtered data
    this.showToastMessage('Filtres réinitialisés', 'info');
  }
  
  // Status filter
  filterByStatus(status: string): void {
    this.showToastMessage(`Filtrage par ${status}`, 'success');
    
    // Here you would filter the data based on status
    console.log('Filtering by status:', status);
  }
  
  // Sorting
  sortTable(table: string, field: string): void {
    // Toggle sort direction or set initial
    if (this.sortCriteria?.table === table && this.sortCriteria?.field === field) {
      this.sortCriteria.direction = this.sortCriteria.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortCriteria = { table, field, direction: 'asc' };
    }
    
    // Sort the data
    if (table === 'visites') {
      this.visites = [...this.visites].sort((a, b) => {
        const aValue = a[field as keyof Visit];
        const bValue = b[field as keyof Visit];
        
        if (aValue != null && bValue != null && aValue < bValue) return this.sortCriteria!.direction === 'asc' ? -1 : 1;
        if (aValue != null && bValue != null && aValue > bValue) return this.sortCriteria!.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else if (table === 'rdv') {
      this.rendezVous = [...this.rendezVous].sort((a, b) => {
        const aValue = a[field as keyof RendezVous];
        const bValue = b[field as keyof RendezVous];
        
        if (aValue != null && bValue != null && aValue < bValue) return this.sortCriteria!.direction === 'asc' ? -1 : 1;
        if (aValue != null && bValue != null && aValue > bValue) return this.sortCriteria!.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }
  
  // Employee navigation
  navigateEmployee(direction: 'prev' | 'next'): void {
    if (!this.client?.employees || this.client.employees.length === 0) return;
    
    if (direction === 'prev' && this.currentEmployeeIndex > 1) {
      this.currentEmployeeIndex--;
    } else if (direction === 'next' && this.currentEmployeeIndex < this.totalEmployees) {
      this.currentEmployeeIndex++;
    }
    
    this.employee = this.client.employees[this.currentEmployeeIndex - 1] as unknown as Employee;
    this.showToastMessage(`Employé ${this.currentEmployeeIndex}/${this.totalEmployees}`, 'success');
  }
  
  // Action buttons
  contactManager(): void {
    this.showToastMessage('Contacter le manager', 'success');
    // Open email client or modal
  }
  
  contactAssistant(): void {
    this.showToastMessage('Contacter l\'assistante SPST', 'success');
    // Open email client or modal
  }
  
  contactRRH(): void {
    this.showToastMessage('Contacter le RRH Client', 'success');
    // Open email client or modal
  }
  
  accessSPST(): void {
    this.showToastMessage('Accès au portail SPST', 'success');
    // Navigate to SPST portal
    window.open(this.spst?.url || '#', '_blank');
  }
  
  // Export functions
  exportVisits(format: 'pdf' | 'excel'): void {
    this.showToastMessage(`Export des visites en ${format.toUpperCase()}`, 'success');
    // Handle export logic
  }
  
  exportAppointments(format: 'pdf' | 'excel'): void {
    this.showToastMessage(`Export des rendez-vous en ${format.toUpperCase()}`, 'success');
    // Handle export logic
  }
  
  // Visit CRUD operations
  openNewVisitModal(): void {
    this.isEditingVisite = false;
    this.visitForm.reset({
      type: 'VIPP',
      etat: 'Programmée',
      suivi: 'SIR B',
      apte: false
    });
    this.showVisitModal = true;
  }
  
  editVisite(visite: Visit): void {
    this.isEditingVisite = true;
    this.visitForm.patchValue({
      type: visite.type,
      etat: visite.etat,
      envisagee: visite.envisagee,
      effectuee: visite.effectuee || '',
      suivi: visite.suivi,
      apte: visite.apte
    });
    this.showVisitModal = true;
  }
  
  viewVisiteDetails(visite: Visit): void {
    this.showToastMessage(`Détails de la visite ${visite.id}`, 'success');
    // Open details view or modal
  }
  
  confirmDeleteVisite(visite: Visit): void {
    this.confirmationMessage = `Êtes-vous sûr de vouloir supprimer cette visite du ${visite.envisagee} ?`;
    this.confirmationCallback = () => this.deleteVisite(visite);
    this.showConfirmationModal = true;
  }
  
  deleteVisite(visite: Visit): void {
    this.visites = this.visites.filter(v => v.id !== visite.id);
    this.showToastMessage('Visite supprimée avec succès', 'success');
  }
  
  closeVisitModal(): void {
    this.showVisitModal = false;
  }
  
  saveVisit(): void {
    if (this.visitForm.invalid) {
      this.showToastMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    
    const formValue = this.visitForm.value;
    
    if (this.isEditingVisite) {
      // Update existing visit
      const index = this.visites.findIndex(v => v.id === formValue.id);
      if (index !== -1) {
        this.visites[index] = { ...this.visites[index], ...formValue };
      }
      this.showToastMessage('Visite mise à jour avec succès', 'success');
    } else {
      // Create new visit
      const newVisit: Visit = {
        id: Math.max(0, ...this.visites.map(v => v.id)) + 1,
        ...formValue
      };
      this.visites.push(newVisit);
      this.showToastMessage('Nouvelle visite créée avec succès', 'success');
    }
    
    this.closeVisitModal();
  }
  
  // Appointment CRUD operations
  openNewAppointmentModal(): void {
    this.isEditingRdv = false;
    this.appointmentForm.reset({
      ar: false,
      ordonnance: false,
      accepte: false,
      excusable: false,
      reporte: false,
      honore: false
    });
    this.showAppointmentModal = true;
  }
  
  editRdv(rdv: RendezVous): void {
    this.isEditingRdv = true;
    this.appointmentForm.patchValue({
      date: rdv.date,
      envoi: rdv.envoi,
      ar: rdv.ar,
      ordonnance: rdv.ordonnance,
      accepte: rdv.accepte,
      excusable: rdv.excusable,
      reporte: rdv.reporte,
      honore: rdv.honore,
      motif: rdv.motif || '',
      commentaire: rdv.commentaire || ''
    });
    this.showAppointmentModal = true;
  }
  
  viewRdvDetails(rdv: RendezVous): void {
    this.showToastMessage(`Détails du rendez-vous du ${rdv.date}`, 'success');
    // Open details view or modal
  }
  
  confirmDeleteRdv(rdv: RendezVous): void {
    this.confirmationMessage = `Êtes-vous sûr de vouloir supprimer ce rendez-vous du ${rdv.date} ?`;
    this.confirmationCallback = () => this.deleteRdv(rdv);
    this.showConfirmationModal = true;
  }
  
  deleteRdv(rdv: RendezVous): void {
    this.rendezVous = this.rendezVous.filter(r => r.id !== rdv.id);
    this.showToastMessage('Rendez-vous supprimé avec succès', 'success');
  }
  
  closeAppointmentModal(): void {
    this.showAppointmentModal = false;
  }
  
  saveAppointment(): void {
    if (this.appointmentForm.invalid) {
      this.showToastMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    
    const formValue = this.appointmentForm.value;
    
    if (this.isEditingRdv) {
      // Update existing appointment
      const index = this.rendezVous.findIndex(r => r.id === formValue.id);
      if (index !== -1) {
        this.rendezVous[index] = { ...this.rendezVous[index], ...formValue };
      }
      this.showToastMessage('Rendez-vous mis à jour avec succès', 'success');
    } else {
      // Create new appointment
      const newRdv: RendezVous = {
        id: Math.max(0, ...this.rendezVous.map(r => r.id)) + 1,
        ...formValue
      };
      this.rendezVous.push(newRdv);
      this.showToastMessage('Nouveau rendez-vous créé avec succès', 'success');
    }
    
    this.closeAppointmentModal();
  }
  
  // Incident handling
  declareIncident(): void {
    this.incidentForm.reset({
      type: '',
      severity: 'medium',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    this.showIncidentModal = true;
  }
  
  closeIncidentModal(): void {
    this.showIncidentModal = false;
  }
  
  submitIncident(): void {
    if (this.incidentForm.invalid) {
      this.showToastMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    
    // Process incident submission
    this.showToastMessage('Incident déclaré avec succès', 'success');
    this.closeIncidentModal();
  }
  
  // Confirmation modal handling
  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.confirmationCallback = null;
  }
  
    confirmAction(): void {
      if (this.confirmationCallback) {
        this.confirmationCallback();
      }
      this.closeConfirmationModal();
    }
  }