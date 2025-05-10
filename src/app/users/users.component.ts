import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MyHeaderComponent } from "../my-header/my-header.component";

interface Client {
  id: number;
  name: string;
  logo: string;
  favorite?: boolean;
  indicators: {
    mouvements?: number;
    joursRetards?: number;
    etablissementsInconnus?: number;
    importsEnAttente?: number;
    facturesEnAttente?: number;
    facturesRapprochement?: number;
    rejetImport?: number;
    [key: string]: number | undefined;
  };
}

interface LegendItem {
  label: string;
  color: string;
  value: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, MyHeaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UserComponent implements OnInit {
  clients: Client[] = [];
  searchText = '';
  selectedIndicator = '';
  viewMode = 'grid'; // 'grid' or 'list'
  isLoading = true;
  sortOption = 'name_asc';
  
  indicatorOptions = [
    'mouvements', 
    'joursRetards', 
    'etablissementsInconnus',
    'importsEnAttente',
    'facturesEnAttente',
    'facturesRapprochement',
    'rejetImport'
  ];
  
  legendItems: LegendItem[] = [
    { label: 'Mouvements', color: 'red', value: 'mouvements' },
    { label: 'Jours de retards d\'import', color: 'green', value: 'joursRetards' },
    { label: 'Etablissements inconnus', color: 'blue', value: 'etablissementsInconnus' },
    { label: 'Imports en attentes', color: 'orange', value: 'importsEnAttente' },
    { label: 'Factures en attente de paiement', color: 'magenta', value: 'facturesEnAttente' },
    { label: 'Factures en attente de rapprochement', color: 'purple', value: 'facturesRapprochement' },
    { label: 'Rejet import', color: 'brown', value: 'rejetImport' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Simulate loading data from an API
    setTimeout(() => {
      // Create 21 sample clients with the requested naming scheme
      this.clients = Array.from({ length: 21 }, (_, i) => ({
        id: i + 1,
        name: `client${i + 1}`,
        logo: 'assets/logos/client.png',
        favorite: Math.random() > 0.7, // Randomly mark some as favorites for demo
        indicators: {
          mouvements: Math.floor(Math.random() * 15),
          joursRetards: Math.floor(Math.random() * 10),
          etablissementsInconnus: Math.floor(Math.random() * 8),
          importsEnAttente: Math.floor(Math.random() * 5),
          facturesEnAttente: Math.floor(Math.random() * 8),
          facturesRapprochement: Math.floor(Math.random() * 4),
          rejetImport: Math.floor(Math.random() * 3)
        }
      }));
      
      this.isLoading = false;
      this.sortClients(this.sortOption);
    }, 1000);
  }

  get filteredClients() {
    if (!this.clients.length) return [];
    
    return this.clients.filter(client => {
      const nameMatch = client.name.toLowerCase().includes(this.searchText.toLowerCase());
      const indicatorMatch = !this.selectedIndicator || 
                            (client.indicators[this.selectedIndicator] !== undefined && 
                             client.indicators[this.selectedIndicator]! > 0);
      
      return nameMatch && indicatorMatch;
    });
  }

  sortClients(option: string) {
    this.sortOption = option;
    
    switch(option) {
      case 'name_asc':
        this.clients.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        this.clients.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'id_asc':
        this.clients.sort((a, b) => a.id - b.id);
        break;
      case 'id_desc':
        this.clients.sort((a, b) => b.id - a.id);
        break;
      case 'indicators':
        this.clients.sort((a, b) => {
          const countA = Object.values(a.indicators).filter(v => v && v > 0).length;
          const countB = Object.values(b.indicators).filter(v => v && v > 0).length;
          return countB - countA;
        });
        break;
      default:
        break;
    }
  }

  goToClientProfile(clientId: number) {
    console.log('Navigating to client ID:', clientId);
    this.router.navigate(['/client-assign', clientId]);
  }
  
  exportClientData(clientId: number) {
    console.log('Exporting data for client ID:', clientId);
    // Implementation for exporting client data would go here
    alert(`Export des données pour le client #${clientId} initié`);
  }
  
  toggleFavorite(client: Client) {
    client.favorite = !client.favorite;
    console.log(`Client ${client.id} favorite status: ${client.favorite}`);
  }
  
  resetFilters() {
    this.searchText = '';
    this.selectedIndicator = '';
  }
  
  getIndicatorLabel(indicatorKey: string): string {
    const found = this.legendItems.find(item => item.value === indicatorKey);
    return found ? found.label : indicatorKey;
  }
  
  getIndicatorCount(indicatorKey: string): number {
    return this.clients.filter(client => 
      client.indicators[indicatorKey] !== undefined && 
      client.indicators[indicatorKey]! > 0
    ).length;
  }
}