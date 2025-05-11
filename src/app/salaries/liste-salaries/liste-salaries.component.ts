// Modified liste-salaries.component.ts
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SidebarClientComponent } from '../../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { SalarieService, Salarie } from '../../services/salarie.service';
import { ClientService } from '../../services/client.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-liste-salaries',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarClientComponent, MyHeaderComponent, RouterModule],
  templateUrl: './liste-salaries.component.html',
  styleUrls: ['./liste-salaries.component.css']
})
export class ListeSalariesComponent implements OnInit, OnDestroy {
  @Input() clientId?: number;

  sidebarCollapsed = false;
  salaries: Salarie[] = [];
  searchText: string = '';
  sortField: string = 'nom';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedDepartment: string = '';
  departements: string[] = [];
  isLoading = true;
  clientName: string = '';
  currentClient: any = null;

  // Toast notification
  showToast = false;
  toastMessage = '';
  toastType: string = 'success';

  private destroy$ = new Subject<void>();

  constructor(
    private salarieService: SalarieService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get filteredSalaries() {
    // Appliquer uniquement les filtres de recherche et de département
    // ainsi que le tri, car le filtrage par clientId est fait côté serveur
    return this.salaries
      .filter(salarie =>
        (salarie.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
         salarie.matricule.toLowerCase().includes(this.searchText.toLowerCase()) ||
         (salarie.poste && salarie.poste.toLowerCase().includes(this.searchText.toLowerCase())))
        &&
        (this.selectedDepartment === '' ||
         salarie.departement === this.selectedDepartment)
      )
      .sort((a, b) => {
        let aValue = this.getSortValue(a, this.sortField);
        let bValue = this.getSortValue(b, this.sortField);
        if (aValue === bValue) return 0;
        const result = aValue < bValue ? -1 : 1;
        return this.sortDirection === 'asc' ? result : -result;
      });
  }

  ngOnInit(): void {
    console.log('Initial clientId from @Input:', this.clientId);

    // Vérifier si clientId a été passé directement comme @Input
    if (this.clientId) {
      this.loadClientInfo(this.clientId);
      this.loadSalaries(this.clientId);
    } else {
      // Sinon vérifier s'il est dans les paramètres de route
      this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
        console.log('Route params:', params);
        if (params['clientId']) {
          const clientId = +params['clientId'];
          console.log('Found clientId in params:', clientId);
          this.clientId = clientId;
          this.loadClientInfo(clientId);
          this.loadSalaries(clientId);
        } else {
          console.log('No clientId in params, loading all employees');
          this.loadSalaries();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClientInfo(clientId: number): void {
    this.clientService.getClientById(clientId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (client: any) => {
        this.currentClient = client;
        this.clientName = client.name;
        console.log('Loaded client:', client.name, 'with ID:', client.id);
      },
      error: (error: Error) => {
        console.error('Error loading client:', error);
        this.showToastMessage('Erreur lors du chargement du client', 'error');
      }
    });
  }

  loadSalaries(clientId?: number): void {
    console.log("Loading salaries with clientId:", clientId);
    this.isLoading = true;

    // Utilisation du service pour récupérer les salariés, filtré par clientId si spécifié
    this.salarieService.getSalaries().pipe(takeUntil(this.destroy$)).subscribe({
      next: (salaries) => {
        console.log("Received salaries:", salaries);
        this.salaries = salaries;
        this.extractDepartements();
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement des employés:', error);
        this.isLoading = false;
        this.showToastMessage('Erreur lors du chargement des employés', 'error');
      }
    });
  }

  extractDepartements(): void {
    const departementSet = new Set<string>();
    // Les salariés sont déjà filtrés par client, donc pas besoin de filtrer à nouveau
    this.salaries.forEach(s => {
      if (s.departement) {
        departementSet.add(s.departement);
      }
    });
    this.departements = Array.from(departementSet).sort();
  }

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  getSortValue(salarie: Salarie, field: string): any {
    switch(field) {
      case 'nom': return salarie.nom?.toLowerCase() || '';
      case 'matricule': return salarie.matricule?.toLowerCase() || '';
      case 'poste': return salarie.poste?.toLowerCase() || '';
      case 'departement': return salarie.departement?.toLowerCase() || '';
      case 'dateEmbauche': return salarie.dateEmbauche || '';
      default: return salarie.nom?.toLowerCase() || '';
    }
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  deleteSalarie(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer ce salarié?')) {
      this.salarieService.deleteSalarie(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.salaries = this.salaries.filter(s => s.id !== id);
          this.showToastMessage('Salarié supprimé avec succès', 'success');
        },
        error: (error: Error) => {
          console.error('Erreur lors de la suppression de l\'employé:', error);
          this.showToastMessage('Erreur lors de la suppression de l\'employé', 'error');
        }
      });
    }
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedDepartment = '';
    this.sortField = 'nom';
    this.sortDirection = 'asc';
  }

  viewSalarie(salarieId: number): void {
    // Navigate to client-assign with the selected employee
    if (this.clientId) {
      this.router.navigate(['/client-assign', this.clientId, { employeeId: salarieId }]);
    } else {
      // If no client ID, just navigate to employee detail
      this.router.navigate(['/edit-salarie', salarieId]);
    }
  }

  goToAddSalarie(): void {
    if (this.clientId) {
      this.router.navigate(['/add-salarie', { clientId: this.clientId }]);
    } else {
      this.router.navigate(['/add-salarie']);
    }
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
}
