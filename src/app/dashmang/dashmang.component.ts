// dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Manager {
  id: number;
  name: string;
  department: string;
  performance: number;
  tasksCompleted: number;
  pending: number;
}

interface StatData {
  name: string;
  value: number;
}


@Component({
  selector: 'app-dashmang',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashmang.component.html',
  styleUrl: './dashmang.component.css'
})
export class DashmangComponent implements OnInit {
  managers: Manager[] = [];
  selectedManager: Manager | null = null;
  performanceData: StatData[] = [];
  tasksData: StatData[] = [];
  isSidebarExpanded = false;
  isServiceMenuOpen = false;
  notifications = 5;
  messages = 3;

  // Liste de managers
 Manager = [
    { id: 1, name: 'Sophie Martin', department: 'Ressources Humaines', performance: 87, tasksCompleted: 45, pending: 5 },
    { id: 2, name: 'Thomas Dubois', department: 'Finance', performance: 92, tasksCompleted: 38, pending: 2 },
    { id: 3, name: 'Claire Lefebvre', department: 'Marketing', performance: 78, tasksCompleted: 32, pending: 8 },
    { id: 4, name: 'Antoine Bernard', department: 'Opérations', performance: 85, tasksCompleted: 42, pending: 10 }
  ];

  
  constructor(private router: Router) { }
  
  ngOnInit(): void {
    // Initialement sélectionner le premier manager
    if (this.managers.length > 0) {
      this.selectedManager = this.managers[0];
    }
  }
  navigateToForm() {
    this.router.navigate(['/form']);
  }
  navigateToAccess(){
    this.router.navigate(['/acces']);
  }
  selectManager(manager: Manager): void {
    this.selectedManager = manager;
    this.updateChartData()
  }
  
  navigateAndExpand(): void {
    if (!this.isSidebarExpanded) {
      this.isSidebarExpanded = true;
    }
  }
  
  toggleServiceMenu(): void {
    this.isServiceMenuOpen = !this.isServiceMenuOpen;
    if (this.isServiceMenuOpen && !this.isSidebarExpanded) {
      this.isSidebarExpanded = true;
    }
  }


  updateChartData(): void {
    if (this.selectedManager) {
      this.performanceData = [
        { name: 'Performance', value: this.selectedManager.performance },
        { name: 'Reste', value: 100 - this.selectedManager.performance }
      ];
      
      this.tasksData = [
        { name: 'Terminées', value: this.selectedManager.tasksCompleted },
        { name: 'En attente', value: this.selectedManager.pending }
      ];
    }
  }

}
