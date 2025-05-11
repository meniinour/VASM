// Updated client-assign.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { EmployeeService } from '../services/employee.service';
import { VisitService, Visit } from '../services/visit.service';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { CommunicationService } from '../services/communication.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-client-assign',
  standalone: true,
  imports: [
    CommonModule,
    SidebarClientComponent,
    MyHeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './client-assign.component.html',
  styleUrls: ['./client-assign.component.css']
})
export class ClientAssignComponent implements OnInit, OnDestroy {
  // UI state
  sidebarCollapsed = false;
  activeTab: string = 'tab1';
  isLoading = false;

  // Data
  client: any;
  employee: any;
  spst: any = {};
  contact: any = {};
  visites: Visit[] = [];
  rendezVous: Appointment[] = [];

  // Filters and sorting
  filterCriteria: any = {};
  sortCriteria: { table: string, field: string, direction: 'asc' | 'desc' } | null = null;

  // Indicators
  indicators = {
    programmees: 0,
    suspendues: 0,
    sensibles: 0,
    sansAS: 0
  };

  // Employee navigation
  currentEmployeeIndex: number = 1;
  totalEmployees: number = 0;

  // Filter options
  etablissements: string[] = ['ASTBTP13 Marseille', 'ASTBTP69 Lyon', 'ASTBTP75 Paris'];
  assistants: string[] = ['MATTONE SABRINA', 'DUPONT JEAN', 'MARTIN SOPHIE'];

  // Modal state
  showAppointmentModal = false;
  showVisitModal = false;
  showConfirmationModal = false;
  showIncidentModal = false;
  showEmailModal = false;
  isEditingRdv = false;
  isEditingVisite = false;
  confirmationMessage = '';
  confirmationCallback: (() => void) | null = null;

  // Toast notification
  showToast = false;
  toastMessage = '';
  toastType: string = 'success';

  // Forms
  appointmentForm: FormGroup;
  visitForm: FormGroup;
  incidentForm: FormGroup;
  emailForm: FormGroup;

  // Email target type
  emailTarget: 'manager' | 'assistant' | 'rrh' = 'manager';

  // Destroy subject for subscription cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private clientService: ClientService,
    private employeeService: EmployeeService,
    private visitService: VisitService,
    private appointmentService: AppointmentService,
    private communicationService: CommunicationService
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

    this.emailForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Fetch client ID from route parameters
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const clientId = Number(params['id']);
      // Load client data based on the client ID
      this.loadClient(clientId);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClient(clientId: number): void {
    this.isLoading = true;

    this.clientService.getClientById(clientId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (client: any) => {
        this.client = client;

        // Set indicators from client data
        if (this.client.indicators) {
          this.indicators = {
            programmees: this.client.indicators.programmees || 145,
            suspendues: this.client.indicators.suspendues || 73,
            sensibles: this.client.indicators.sensibles || 12,
            sansAS: this.client.indicators.sansAS || 13
          };
        }

        // Load employees for this client
        this.loadEmployees(clientId);

        // Set contact info
        if (this.client.contact) {
          this.contact = this.client.contact;
        }

        // Set SPST info (static for now)
        this.spst = {
          name: 'ASTBTP13 Marseille',
          address: '35 Rue Nau, 13006 Marseille',
          postalCode: '13006',
          city: 'Marseille',
          phone: '04 91 23 03 30',
          url: 'https://www.astbtp13.fr',
          message: 'Service disponible 24/7'
        };

        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error loading client:', error);
        this.isLoading = false;
        this.showToastMessage('Erreur lors du chargement du client', 'error');
      }
    });
  }

  loadEmployees(clientId: number): void {
    this.employeeService.getEmployeesByClient(clientId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (employees) => {
        if (employees && employees.length > 0) {
          this.employee = employees[0];
          this.currentEmployeeIndex = 1;
          this.totalEmployees = employees.length;

          // Load visits and appointments for the selected employee
          this.loadVisits(this.employee.id);
          this.loadAppointments(this.employee.id);
        } else {
          this.employee = null;
          this.currentEmployeeIndex = 0;
          this.totalEmployees = 0;
          this.visites = [];
          this.rendezVous = [];
        }
      },
      error: (error: Error) => {
        console.error('Error loading employees:', error);
        this.showToastMessage('Erreur lors du chargement des employés', 'error');
      }
    });
  }

  loadVisits(employeeId: number): void {
    this.visitService.getVisits({ employee_id: employeeId }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (visits) => {
        this.visites = visits;
      },
      error: (error: Error) => {
        console.error('Error loading visits:', error);
        this.showToastMessage('Erreur lors du chargement des visites', 'error');
      }
    });
  }

  loadAppointments(employeeId: number): void {
    this.appointmentService.getAppointments({ employee_id: employeeId }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (appointments) => {
        this.rendezVous = appointments;
      },
      error: (error: Error) => {
        console.error('Error loading appointments:', error);
        this.showToastMessage('Erreur lors du chargement des rendez-vous', 'error');
      }
    });
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
    console.log('Applying filters:', this.filterCriteria);
  }

  showToastMessage(message: string, type: string): void {
    this.toastMessage = message;
    this.toastType = type;
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
        const aValue = a[field as keyof Appointment];
        const bValue = b[field as keyof Appointment];

        if (aValue != null && bValue != null && aValue < bValue) return this.sortCriteria!.direction === 'asc' ? -1 : 1;
        if (aValue != null && bValue != null && aValue > bValue) return this.sortCriteria!.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  // Employee navigation
  navigateEmployee(direction: 'prev' | 'next'): void {
    if (!this.client) return;

    if (direction === 'prev' && this.currentEmployeeIndex > 1) {
      this.currentEmployeeIndex--;
    } else if (direction === 'next' && this.currentEmployeeIndex < this.totalEmployees) {
      this.currentEmployeeIndex++;
    }

    this.employeeService.getEmployeesByClient(this.client.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (employees) => {
        if (employees && employees.length > 0) {
          this.employee = employees[this.currentEmployeeIndex - 1];

          // Load visits and appointments for the selected employee
          this.loadVisits(this.employee.id);
          this.loadAppointments(this.employee.id);

          this.showToastMessage(`Employé ${this.currentEmployeeIndex}/${this.totalEmployees}`, 'success');
        }
      },
      error: (error: Error) => {
        console.error('Error loading employees:', error);
        this.showToastMessage('Erreur lors du chargement des employés', 'error');
      }
    });
  }

  // Action buttons - Email Modal Handling
  openEmailModal(target: 'manager' | 'assistant' | 'rrh'): void {
    this.emailTarget = target;
    this.emailForm.reset({
      subject: `Message concernant ${this.employee?.name || 'un employé'}`,
      message: ''
    });
    this.showEmailModal = true;
  }

  closeEmailModal(): void {
    this.showEmailModal = false;
  }

  sendEmail(): void {
    if (this.emailForm.invalid) {
      this.showToastMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    const formValue = this.emailForm.value;
    this.isLoading = true;

    const request = {
      subject: formValue.subject,
      message: formValue.message
    };

    switch (this.emailTarget) {
      case 'manager':
        this.communicationService.contactManager({
          employee_id: this.employee.id,
          ...request
        }).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.showToastMessage('Email envoyé au manager avec succès', 'success');
            this.closeEmailModal();
          },
          error: (error: Error) => {
            console.error('Error sending email:', error);
            this.isLoading = false;
            this.showToastMessage('Erreur lors de l\'envoi de l\'email', 'error');
          }
        });
        break;

      case 'assistant':
        this.communicationService.contactAssistant({
          employee_id: this.employee.id,
          ...request
        }).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.showToastMessage('Email envoyé à l\'assistante SPST avec succès', 'success');
            this.closeEmailModal();
          },
          error: (error: Error) => {
            console.error('Error sending email:', error);
            this.isLoading = false;
            this.showToastMessage('Erreur lors de l\'envoi de l\'email', 'error');
          }
        });
        break;

      case 'rrh':
        this.communicationService.contactRRH({
          client_id: this.client.id,
          ...request
        }).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.showToastMessage('Email envoyé au RRH avec succès', 'success');
            this.closeEmailModal();
          },
          error: (error: Error) => {
            console.error('Error sending email:', error);
            this.isLoading = false;
            this.showToastMessage('Erreur lors de l\'envoi de l\'email', 'error');
          }
        });
        break;
    }
  }

  // Action buttons
  contactManager(): void {
    this.openEmailModal('manager');
  }

  contactAssistant(): void {
    this.openEmailModal('assistant');
  }

  contactRRH(): void {
    this.openEmailModal('rrh');
  }

  accessSPST(): void {
    this.showToastMessage('Accès au portail SPST', 'success');
    window.open(this.spst?.url || 'https://www.astbtp13.fr', '_blank');
  }

  declareIncident(): void {
    this.incidentForm.reset({
      type: '',
      severity: 'medium',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    this.showIncidentModal = true;
  }

  // Export functions
  exportVisits(format: 'pdf' | 'excel'): void {
    this.isLoading = true;

    // Create filters specific to this client's employees
    const employeeIds = this.employee ? [this.employee.id] : [];

    this.visitService.exportVisits(format, { employee_ids: employeeIds.join(',') }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (blob: Blob) => {
        // Create a download link and trigger it
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = `visites_${this.client?.name || 'client'}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
        this.showToastMessage(`Visites exportées en ${format.toUpperCase()} avec succès`, 'success');
      },
      error: (error: Error) => {
        console.error(`Error exporting visits as ${format}:`, error);
        this.isLoading = false;
        this.showToastMessage(`Erreur lors de l'exportation des visites en ${format.toUpperCase()}`, 'error');
      }
    });
  }

  exportAppointments(format: 'pdf' | 'excel'): void {
    this.isLoading = true;

    // Create filters specific to this client's employees
    const employeeIds = this.employee ? [this.employee.id] : [];

    this.appointmentService.exportAppointments(format, { employee_ids: employeeIds.join(',') }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (blob: Blob) => {
        // Create a download link and trigger it
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = `rendez_vous_${this.client?.name || 'client'}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
        this.showToastMessage(`Rendez-vous exportés en ${format.toUpperCase()} avec succès`, 'success');
      },
      error: (error: Error) => {
        console.error(`Error exporting appointments as ${format}:`, error);
        this.isLoading = false;
        this.showToastMessage(`Erreur lors de l'exportation des rendez-vous en ${format.toUpperCase()}`, 'error');
      }
    });
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
    // Store the ID for update
    this.visitForm.addControl('id', this.fb.control(visite.id));
    this.showVisitModal = true;
  }

  viewVisiteDetails(visite: Visit): void {
    this.showToastMessage(`Détails de la visite ${visite.id}`, 'success');
    // In a real app, this would open a detail view or modal
    // For now, just log the details
    console.log('Visite details:', visite);
  }

  confirmDeleteVisite(visite: Visit): void {
    this.confirmationMessage = `Êtes-vous sûr de vouloir supprimer cette visite du ${visite.envisagee} ?`;
    this.confirmationCallback = () => this.deleteVisite(visite);
    this.showConfirmationModal = true;
  }

  deleteVisite(visite: Visit): void {
    this.isLoading = true;

    this.visitService.deleteVisit(visite.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.visites = this.visites.filter(v => v.id !== visite.id);
        this.isLoading = false;
        this.showToastMessage('Visite supprimée avec succès', 'success');
      },
      error: (error: Error) => {
        console.error('Error deleting visit:', error);
        this.isLoading = false;
        this.showToastMessage('Erreur lors de la suppression de la visite', 'error');
      }
    });
  }

  closeVisitModal(): void {
    this.showVisitModal = false;
    // Remove the id control if it was added
    if (this.visitForm.contains('id')) {
      this.visitForm.removeControl('id');
    }
  }

  saveVisit(): void {
    if (this.visitForm.invalid) {
      this.showToastMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    const formValue = this.visitForm.value;
    this.isLoading = true;

    if (this.isEditingVisite) {
      // Update existing visit
      this.visitService.updateVisit(formValue.id, {
        employee_id: this.employee.id,
        ...formValue
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (updatedVisit) => {
          // Update local array
          const index = this.visites.findIndex(v => v.id === updatedVisit.id);
          if (index !== -1) {
            this.visites[index] = updatedVisit;
          }
          this.isLoading = false;
          this.showToastMessage('Visite mise à jour avec succès', 'success');
          this.closeVisitModal();
        },
        error: (error: Error) => {
          console.error('Error updating visit:', error);
          this.isLoading = false;
          this.showToastMessage('Erreur lors de la mise à jour de la visite', 'error');
        }
      });
    } else {
      // Create new visit
      this.visitService.createVisit({
        employee_id: this.employee.id,
        ...formValue
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (newVisit: Visit) => {
          this.visites.push(newVisit);
          this.isLoading = false;
          this.showToastMessage('Nouvelle visite créée avec succès', 'success');
          this.closeVisitModal();
        },
        error: (error: Error) => {
          console.error('Error creating visit:', error);
          this.isLoading = false;
          this.showToastMessage('Erreur lors de la création de la visite', 'error');
        }
      });
    }
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

  editRdv(rdv: Appointment): void {
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
    // Store the ID for update
    this.appointmentForm.addControl('id', this.fb.control(rdv.id));
    this.showAppointmentModal = true;
  }

  viewRdvDetails(rdv: Appointment): void {
    this.showToastMessage(`Détails du rendez-vous du ${rdv.date}`, 'success');
    // In a real app, this would open a detail view or modal
    // For now, just log the details
    console.log('RDV details:', rdv);
  }

  confirmDeleteRdv(rdv: Appointment): void {
    this.confirmationMessage = `Êtes-vous sûr de vouloir supprimer ce rendez-vous du ${rdv.date} ?`;
    this.confirmationCallback = () => this.deleteRdv(rdv);
    this.showConfirmationModal = true;
  }

  deleteRdv(rdv: Appointment): void {
    this.isLoading = true;

    this.appointmentService.deleteAppointment(rdv.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.rendezVous = this.rendezVous.filter(r => r.id !== rdv.id);
        this.isLoading = false;
        this.showToastMessage('Rendez-vous supprimé avec succès', 'success');
      },
      error: (error: Error) => {
        console.error('Error deleting appointment:', error);
        this.isLoading = false;
        this.showToastMessage('Erreur lors de la suppression du rendez-vous', 'error');
      }
    });
  }

  closeAppointmentModal(): void {
    this.showAppointmentModal = false;
    // Remove the id control if it was added
    if (this.appointmentForm.contains('id')) {
      this.appointmentForm.removeControl('id');
    }
  }

  saveAppointment(): void {
    if (this.appointmentForm.invalid) {
      this.showToastMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    const formValue = this.appointmentForm.value;
    this.isLoading = true;

    if (this.isEditingRdv) {
      // Update existing appointment
      this.appointmentService.updateAppointment(formValue.id, {
        employee_id: this.employee.id,
        ...formValue
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (updatedAppointment) => {
          // Update local array
          const index = this.rendezVous.findIndex(r => r.id === updatedAppointment.id);
          if (index !== -1) {
            this.rendezVous[index] = updatedAppointment;
          }
          this.isLoading = false;
          this.showToastMessage('Rendez-vous mis à jour avec succès', 'success');
          this.closeAppointmentModal();
        },
        error: (error: Error) => {
          console.error('Error updating appointment:', error);
          this.isLoading = false;
          this.showToastMessage('Erreur lors de la mise à jour du rendez-vous', 'error');
        }
      });
    } else {
      // Create new appointment
      this.appointmentService.createAppointment({
        employee_id: this.employee.id,
        ...formValue
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (newAppointment: Appointment) => {
          this.rendezVous.push(newAppointment);
          this.isLoading = false;
          this.showToastMessage('Nouveau rendez-vous créé avec succès', 'success');
          this.closeAppointmentModal();
        },
        error: (error: Error) => {
          console.error('Error creating appointment:', error);
          this.isLoading = false;
          this.showToastMessage('Erreur lors de la création du rendez-vous', 'error');
        }
      });
    }
  }

  closeIncidentModal(): void {
    this.showIncidentModal = false;
  }

  submitIncident(): void {
    if (this.incidentForm.invalid) {
      this.showToastMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    const formValue = this.incidentForm.value;
    this.isLoading = true;

    // Process incident submission using communication service
    this.communicationService.declareIncident({
      client_id: this.client.id,
      ...formValue
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showToastMessage(`Incident déclaré avec succès (Ref: ${response.incident_id})`, 'success');
          this.closeIncidentModal();
        },
        error: (error: Error) => {
          console.error('Error submitting incident:', error);
          this.isLoading = false;
          this.showToastMessage('Erreur lors de la déclaration de l\'incident', 'error');
        }
      });
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
