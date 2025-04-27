import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../../sidebar-client/sidebar-client.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyHeaderComponent } from '../../my-header/my-header.component';
@Component({
  selector: 'app-add-salarie',
  standalone: true,
  imports: [CommonModule, SidebarClientComponent, FormsModule, ReactiveFormsModule,MyHeaderComponent],
  templateUrl: './add-salarie.component.html',
  styleUrls: ['./add-salarie.component.css']
})
export class AddSalarieComponent {
  sidebarCollapsed = false;
  salarieForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.salarieForm = this.fb.group({
      nom: ['', Validators.required],
      matricule: ['', Validators.required]
    });
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  onSubmit() {
    if (this.salarieForm.valid) {
      alert('Salarié ajouté avec succès!');
      this.salarieForm.reset();
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }
}
