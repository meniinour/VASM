import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { SalarieService, Salarie } from '../services/salarie.service';
import { MedecinService, Medecin, RendezVous } from '../services/medecin.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-medecins-rendezvous',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    SidebarClientComponent, 
    MyHeaderComponent, 
    RouterModule
  ],
  templateUrl: './medecins-rendezvous.component.html',
  styleUrls: ['./medecins-rendezvous.component.css']
})
export class MedecinsRendezVousComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  
  // Listes
  medecins: Medecin[] = [];
  salaries: Salarie[] = [];
  rendezVous: RendezVous[] = [];
  
  // Filtres et tri
  searchText: string = '';
  sortField: string = 'nom';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedSpecialite: string = '';
  specialites: string[] = [];
  
  // États
  isLoading = true;
  showRdvForm = false;
  selectedMedecinId: number | null = null;
  selectedSalarieId: number | null = null;
  
  // Formulaire de rendez-vous
  rdvForm: FormGroup;
  rdvSubmitted = false;
  
  // Toast notification
  showToast = false;
  toastMessage = '';
  toastType: string = 'success';
  
  // Pour unsubscribe
  private destroy$ = new Subject<void>();

  constructor(
    private medecinService: MedecinService,
    private salarieService: SalarieService,
    private fb: FormBuilder
  ) {
    this.rdvForm = this.fb.group({
      date: ['', Validators.required],
      heure: ['', Validators.required],
      motif: ['', [Validators.required, Validators.minLength(5)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadMedecins();
    this.loadSalaries();
    this.loadRendezVous();
    
    // Définir la date par défaut (aujourd'hui)
    const today = new Date().toISOString().split('T')[0];
    this.rdvForm.get('date')?.setValue(today);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMedecins(): void {
    this.medecinService.getMedecins().pipe(takeUntil(this.destroy$)).subscribe({
      next: (medecins) => {
        this.medecins = medecins;
        this.extractSpecialites();
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement des médecins:', error);
        this.isLoading = false;
        this.showToastMessage('Erreur lors du chargement des médecins', 'error');
      }
    });
  }

  loadSalaries(): void {
    this.salarieService.getSalaries().pipe(takeUntil(this.destroy$)).subscribe({
      next: (salaries) => {
        this.salaries = salaries;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement des salariés:', error);
        this.showToastMessage('Erreur lors du chargement des salariés', 'error');
      }
    });
  }

  loadRendezVous(): void {
    this.medecinService.getRendezVous().pipe(takeUntil(this.destroy$)).subscribe({
      next: (rdvs) => {
        this.rendezVous = rdvs;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement des rendez-vous:', error);
        this.showToastMessage('Erreur lors du chargement des rendez-vous', 'error');
      }
    });
  }

  extractSpecialites(): void {
    const specialiteSet = new Set<string>();
    this.medecins.forEach(m => {
      if (m.specialite) {
        specialiteSet.add(m.specialite);
      }
    });
    this.specialites = Array.from(specialiteSet).sort();
  }

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  get filteredMedecins() {
    return this.medecins
      .filter(medecin =>
        (medecin.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
         medecin.specialite.toLowerCase().includes(this.searchText.toLowerCase()) ||
         medecin.numeroPro.toLowerCase().includes(this.searchText.toLowerCase()))
        &&
        (this.selectedSpecialite === '' ||
         medecin.specialite === this.selectedSpecialite)
      )
      .sort((a, b) => {
        let aValue = this.getSortValue(a, this.sortField);
        let bValue = this.getSortValue(b, this.sortField);
        if (aValue === bValue) return 0;
        const result = aValue < bValue ? -1 : 1;
        return this.sortDirection === 'asc' ? result : -result;
      });
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  getSortValue(medecin: Medecin, field: string): any {
    switch(field) {
      case 'nom': return medecin.nom?.toLowerCase() || '';
      case 'specialite': return medecin.specialite?.toLowerCase() || '';
      case 'numeroPro': return medecin.numeroPro?.toLowerCase() || '';
      case 'email': return medecin.email?.toLowerCase() || '';
      default: return medecin.nom?.toLowerCase() || '';
    }
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedSpecialite = '';
    this.sortField = 'nom';
    this.sortDirection = 'asc';
  }

  selectMedecin(medecin: Medecin): void {
    this.selectedMedecinId = medecin.id;
    this.showRdvForm = true;
    
    // Faire défiler jusqu'au formulaire
    setTimeout(() => {
      const formElement = document.getElementById('rdv-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  submitRdvForm(): void {
    this.rdvSubmitted = true;

    if (this.rdvForm.valid && this.selectedMedecinId && this.selectedSalarieId) {
      const newRdv = {
        medecinId: this.selectedMedecinId,
        salarieId: this.selectedSalarieId,
        date: this.rdvForm.value.date,
        heure: this.rdvForm.value.heure,
        motif: this.rdvForm.value.motif,
        notes: this.rdvForm.value.notes,
        statut: 'planifié' as 'planifié'
      };

      this.medecinService.addRendezVous(newRdv).pipe(takeUntil(this.destroy$)).subscribe({
        next: (rdv) => {
          this.rendezVous.push(rdv);
          this.resetForm();
          this.showToastMessage('Rendez-vous planifié avec succès', 'success');
        },
        error: (error: Error) => {
          console.error('Erreur lors de la création du rendez-vous:', error);
          this.showToastMessage('Erreur lors de la création du rendez-vous', 'error');
        }
      });
    } else {
      this.showToastMessage('Veuillez compléter tous les champs requis', 'error');
    }
  }

  resetForm(): void {
    this.rdvSubmitted = false;
    this.rdvForm.reset();
    
    // Réinitialiser la date à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    this.rdvForm.get('date')?.setValue(today);
    
    this.selectedMedecinId = null;
    this.selectedSalarieId = null;
    this.showRdvForm = false;
  }

  getMedecinName(medecinId: number): string {
    const medecin = this.medecins.find(m => m.id === medecinId);
    return medecin ? medecin.nom : 'Médecin inconnu';
  }

  getSalarieName(salarieId: number): string {
    const salarie = this.salaries.find(s => s.id === salarieId);
    return salarie ? salarie.nom : 'Salarié inconnu';
  }

  getSpecialiteClass(specialite: string): string {
    // Génère une classe CSS en fonction de la spécialité pour le style des badges
    return 'specialite-' + specialite.toLowerCase().replace(/\s+/g, '-');
  }

  deleteRdv(rdvId: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous?')) {
      this.medecinService.deleteRendezVous(rdvId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (success) => {
          if (success) {
            this.rendezVous = this.rendezVous.filter(r => r.id !== rdvId);
            this.showToastMessage('Rendez-vous annulé avec succès', 'success');
          } else {
            this.showToastMessage('Erreur lors de l\'annulation du rendez-vous', 'error');
          }
        },
        error: (error: Error) => {
          console.error('Erreur lors de l\'annulation du rendez-vous:', error);
          this.showToastMessage('Erreur lors de l\'annulation du rendez-vous', 'error');
        }
      });
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