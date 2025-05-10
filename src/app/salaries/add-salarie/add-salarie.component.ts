import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../../sidebar-client/sidebar-client.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { SalarieService } from '../../services/salarie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-salarie',
  standalone: true,
  imports: [CommonModule, SidebarClientComponent, FormsModule, ReactiveFormsModule, MyHeaderComponent],
  templateUrl: './add-salarie.component.html',
  styleUrls: ['./add-salarie.component.css']
})
export class AddSalarieComponent implements OnInit {
  sidebarCollapsed = false;
  salarieForm: FormGroup;
  submitted = false;
  isLoading = false;
  departments = ['IT', 'Finances', 'RH', 'Marketing', 'Ventes', 'Créatif', 'Management', 'Production'];

  constructor(
    private fb: FormBuilder,
    private salarieService: SalarieService,
    private router: Router
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
    const today = new Date().toISOString().split('T')[0];
    this.salarieForm.get('dateEmbauche')?.setValue(today);
  }

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.salarieForm.valid) {
      this.isLoading = true;

      this.salarieService.addSalarie(this.salarieForm.value).subscribe(
        (response) => {
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
        },
        (error) => {
          console.error('Error adding employee:', error);
          this.isLoading = false;
        }
      );
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.salarieForm.reset();
    const today = new Date().toISOString().split('T')[0];
    this.salarieForm.get('dateEmbauche')?.setValue(today);
  }
}
