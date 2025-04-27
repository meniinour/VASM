// Fichier: access-manager.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface AccessRight {
  id: number;
  name: string;
  enabled: boolean;
}

interface Manager {
  id: number;
  name: string;
  email: string;
  position: string;
  accessLevel: 'high' | 'medium' | 'low';
  accessRights: AccessRight[];
}

@Component({
  selector: 'app-acces',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './acces.component.html',
  styleUrl: './acces.component.css'
})
export class AccesComponent implements OnInit {
  managers: Manager[] = [];
  selectedManager: Manager | null = null;
  availableAccessRights: string[] = ['Tâches', 'Email', 'Rapports', 'Utilisateurs', 'Finances', 'Configuration'];
  
  constructor() { }

  ngOnInit(): void {
    // Simuler des données venant d'une API
    this.loadManagers();
  }

  loadManagers(): void {
    this.managers = [
      {
        id: 1,
        name: 'Jean Dupont',
        email: 'jean.dupont@exemple.com',
        position: 'Chef de projet',
        accessLevel: 'high',
        accessRights: [
          { id: 1, name: 'Tâches', enabled: true },
          { id: 2, name: 'Email', enabled: true },
          { id: 3, name: 'Rapports', enabled: true },
          { id: 4, name: 'Utilisateurs', enabled: true },
          { id: 5, name: 'Finances', enabled: true },
          { id: 6, name: 'Configuration', enabled: false }
        ]
      },
      {
        id: 2,
        name: 'Marie Martin',
        email: 'marie.martin@exemple.com',
        position: 'Gestionnaire RH',
        accessLevel: 'medium',
        accessRights: [
          { id: 1, name: 'Tâches', enabled: true },
          { id: 2, name: 'Email', enabled: true },
          { id: 3, name: 'Rapports', enabled: true },
          { id: 4, name: 'Utilisateurs', enabled: false },
          { id: 5, name: 'Finances', enabled: false },
          { id: 6, name: 'Configuration', enabled: false }
        ]
      },
      {
        id: 3,
        name: 'Thomas Bernard',
        email: 'thomas.bernard@exemple.com',
        position: 'Assistant administratif',
        accessLevel: 'low',
        accessRights: [
          { id: 1, name: 'Tâches', enabled: true },
          { id: 2, name: 'Email', enabled: true },
          { id: 3, name: 'Rapports', enabled: false },
          { id: 4, name: 'Utilisateurs', enabled: false },
          { id: 5, name: 'Finances', enabled: false },
          { id: 6, name: 'Configuration', enabled: false }
        ]
      }
    ];
  }

  selectManager(manager: Manager): void {
    this.selectedManager = {...manager};
  }

  toggleAccess(right: AccessRight): void {
    if (this.selectedManager) {
      right.enabled = !right.enabled;
      this.updateAccessLevel();
    }
  }

  updateAccessLevel(): void {
    if (!this.selectedManager) return;
    
    const enabledCount = this.selectedManager.accessRights.filter(r => r.enabled).length;
    const totalRights = this.selectedManager.accessRights.length;
    
    if (enabledCount >= 5) {
      this.selectedManager.accessLevel = 'high';
    } else if (enabledCount >= 3) {
      this.selectedManager.accessLevel = 'medium';
    } else {
      this.selectedManager.accessLevel = 'low';
    }
  }

  saveChanges(): void {
    if (!this.selectedManager) return;
    
    // Trouver et mettre à jour le gestionnaire dans la liste
    const index = this.managers.findIndex(m => m.id === this.selectedManager!.id);
    if (index !== -1) {
      this.managers[index] = {...this.selectedManager};
    }
    
    // Réinitialiser la sélection
    this.selectedManager = null;
    
    // Dans une application réelle, vous enverriez également les données à une API
    alert('Modifications enregistrées avec succès !');
  }

  cancelChanges(): void {
    this.selectedManager = null;
  }

  getAccessLevelClass(level: string): string {
    return `access-${level}`;
  }


}
