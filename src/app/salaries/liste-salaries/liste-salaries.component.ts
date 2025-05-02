import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarClientComponent } from '../../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { SalarieService, Salarie } from '../../services/salarie.service';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-liste-salaries',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarClientComponent, MyHeaderComponent, RouterModule],
  templateUrl: './liste-salaries.component.html',
  styleUrls: ['./liste-salaries.component.css']
})
export class ListeSalariesComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  salaries: Salarie[] = [];
  searchText: string = '';
  sortField: string = 'nom';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedDepartment: string = '';
  departments: string[] = [];
  isLoading = true;
  
  private destroy$ = new Subject<void>();

  constructor(private salarieService: SalarieService) {}

  get filteredSalaries() {
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
    this.loadSalaries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSalaries(): void {
    this.isLoading = true;
    
    this.salarieService.getSalaries()
      .pipe(takeUntil(this.destroy$))
      .subscribe(salaries => {
        setTimeout(() => { // Simulating network delay
          this.salaries = salaries;
          this.extractDepartments();
          this.isLoading = false;
        }, 800);
      });
  }

  extractDepartments(): void {
    const deptSet = new Set<string>();
    this.salaries.forEach(s => {
      if (s.departement) {
        deptSet.add(s.departement);
      }
    });
    this.departments = Array.from(deptSet).sort();
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
      this.salarieService.deleteSalarie(id);
    }
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedDepartment = '';
    this.sortField = 'nom';
    this.sortDirection = 'asc';
  }
}