import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // 👈 Import important
import clientsData from '../../assets/data/clients.json';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MyHeaderComponent } from "../my-header/my-header.component";
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,RouterModule,SidebarComponent,MyHeaderComponent], // ✅ Ajoute CommonModule ici
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UserComponent {
  clients = clientsData;
  searchText: string = '';
  selectedIndicator: string = '';
  indicatorOptions = ['mouvements', 'joursRetards', 'etablissementsInconnus'];

  constructor(private router: Router) {}

  get filteredClients() {
    return this.clients.filter(client => {
      const nameMatch = client.name.toLowerCase().includes(this.searchText.toLowerCase());
      const indicators = client.indicators as { [key: string]: number };
      const indicatorMatch = !this.selectedIndicator || indicators[this.selectedIndicator] > 0;
      return nameMatch && indicatorMatch;
    });
  }

  goToClientProfile(clientId: number) {
    console.log('Clicked client ID:', clientId);  // 👈 Ajoute ceci

    this.router.navigate(['/client-assign', clientId]);
  }
}
