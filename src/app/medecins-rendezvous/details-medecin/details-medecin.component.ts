import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Ajoutez cette ligne

import { SidebarClientComponent } from '../../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { MedecinService, Medecin, RendezVous } from '../../services/medecin.service';
import { SalarieService, Salarie } from '../../services/salarie.service';

@Component({
  selector: 'app-details-medecin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    SidebarClientComponent,
    MyHeaderComponent
  ],
  templateUrl: './details-medecin.component.html',
  styleUrls: ['./details-medecin.component.css']
})
export class DetailsMedecinComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  medecin: Medecin | null = null;
  rendezVous: RendezVous[] = [];
  salaries: Salarie[] = [];
  isLoading = true;
  notFound = false;
  medecinId: number = 0;
  
  // Toast notification
  showToast = false;
  toastMessage = '';
  toastType: string = 'success';
  
  // Formulaire RDV
  rdvForm: FormGroup;
  rdvSubmitted = false;
  selectedSalarieId: number | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.medecinId = +params['id'];
        this.loadMedecinData(this.medecinId);
        this.loadRendezVous(this.medecinId);
        this.loadSalaries();
        
        // Définir la date par défaut (aujourd'hui)
        const today = new Date().toISOString().split('T')[0];
        this.rdvForm.get('date')?.setValue(today);
      } else {
        this.notFound = true;
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMedecinData(id: number): void {
    this.isLoading = true;

    this.medecinService.getMedecinById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (medecin) => {
        if (medecin) {
          this.medecin = medecin;
          this.notFound = false;
        } else {
          this.notFound = true;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du médecin:', error);
        this.notFound = true;
        this.isLoading = false;
      }
    });
  }

  loadRendezVous(id: number): void {
    this.medecinService.getRendezVousByMedecinId(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (rdvs) => {
        this.rendezVous = rdvs;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rendez-vous:', error);
      }
    });
  }

  loadSalaries(): void {
    this.salarieService.getSalaries().pipe(takeUntil(this.destroy$)).subscribe({
      next: (salaries) => {
        this.salaries = salaries;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des salariés:', error);
      }
    });
  }

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  submitRdvForm(): void {
    this.rdvSubmitted = true;

    if (this.rdvForm.valid && this.selectedSalarieId) {
      const newRdv = {
        medecinId: this.medecinId,
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
        error: (error) => {
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
    
    this.selectedSalarieId = null;
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
        error: (error) => {
          console.error('Erreur lors de l\'annulation du rendez-vous:', error);
          this.showToastMessage('Erreur lors de l\'annulation du rendez-vous', 'error');
        }
      });
    }
  }
  
  getSalarieName(salarieId: number): string {
    const salarie = this.salaries.find(s => s.id === salarieId);
    return salarie ? salarie.nom : 'Salarié inconnu';
  }

  getSpecialiteClass(specialite: string): string {
    return 'specialite-' + specialite.toLowerCase().replace(/\s+/g, '-');
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