import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarClientComponent } from '../../sidebar-client/sidebar-client.component';
import{ MyHeaderComponent } from '../../my-header/my-header.component';
interface Salarie {
  id: number;
  nom: string;
  matricule: string;
}

@Component({
  selector: 'app-liste-salaries',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarClientComponent,MyHeaderComponent],
  templateUrl: './liste-salaries.component.html',
  styleUrls: ['./liste-salaries.component.css']
})
export class ListeSalariesComponent implements OnInit {
  sidebarCollapsed = false;
  salaries: Salarie[] = [
    { id: 1, nom: 'Louis Manas', matricule: '12345' },
    { id: 2, nom: 'Sophie Dubois', matricule: '67890' }
  ];
  searchText: string = '';

  get filteredSalaries() {
    return this.salaries.filter(salarie =>
      salarie.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
      salarie.matricule.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
  
  ngOnInit(): void {}
}
