import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../../sidebar-client/sidebar-client.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { SalarieService, Salarie } from '../../services/salarie.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-salarie',
  standalone: true,
  imports: [CommonModule, SidebarClientComponent, FormsModule, ReactiveFormsModule, MyHeaderComponent, RouterModule],
  templateUrl: './edit-salarie.component.html',
  styleUrls: ['./edit-salarie.component.css']
})
export class EditSalarieComponent implements OnInit {
  sidebarCollapsed = false;
  salarieForm: FormGroup;
  submitted = false;
  isLoading = false;
  notFound = false;
  salarieId: number = 0;
  departments = ['IT', 'Finances', 'RH', 'Marketing', 'Ventes', 'Créatif', 'Management', 'Production'];

  constructor(
    private fb: FormBuilder,
    private salarieService: SalarieService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.salarieForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      matricule: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      poste: ['', Validators.required],
      departement: ['', Validators.required],
      dateEmbauche: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.salarieId = +params['id'];
        this.loadSalarieData(this.salarieId);
      }
    });
  }

  loadSalarieData(id: number): void {
    this.isLoading = true;
    
    setTimeout(() => {
      const salarie = this.salarieService.getSalarieById(id);
      
      if (salarie) {
        this.salarieForm.patchValue({
          nom: salarie.nom,
          matricule: salarie.matricule,
          poste: salarie.poste || '',
          departement: salarie.departement || '',
          dateEmbauche: salarie.dateEmbauche || ''
        });
      } else {
        this.notFound = true;
      }
      
      this.isLoading = false;
    }, 800); // Simulated loading delay
  }

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.salarieForm.valid) {
      this.isLoading = true;
      
      setTimeout(() => {
        const updatedSalarie: Salarie = {
          id: this.salarieId,
          ...this.salarieForm.value
        };
        
        this.salarieService.updateSalarie(updatedSalarie);
        this.isLoading = false;
        
        // Show success message
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
          successMessage.classList.remove('hidden');
          setTimeout(() => {
            successMessage.classList.add('hidden');
            this.router.navigate(['/liste-salaries']);
          }, 2000);
        }
      }, 800); // Simulate network delay
    }
  }
}