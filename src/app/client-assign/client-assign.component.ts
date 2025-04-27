import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { ActivatedRoute } from '@angular/router';
import clientsData from '../../assets/data/clients.json'; // Assuming path to your clients.json
interface Client {
  id: number;
  name: string;
  logo: string;
  indicators: {
    mouvements: number;
    joursRetards: number;
    etablissementsInconnus: number;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    website: string;
    person: string;
    city?: string; // Added city property
  };
  meetings: any[];
  visits: any[];
  employees: any[];
}
@Component({
  selector: 'app-client-assign',
  standalone: true,
  imports: [CommonModule, SidebarClientComponent, MyHeaderComponent],
  templateUrl: './client-assign.component.html',
  styleUrls: ['./client-assign.component.css']
})
export class ClientAssignComponent implements OnInit {
  sidebarCollapsed = false;
  activeTab: string = 'tab1';
  client: Client | undefined;
  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    // Fetch client ID from route parameters
    this.route.params.subscribe(params => {
      const clientId = Number(params['id']);
      // Load client data based on the client ID
      this.loadClient(clientId);
    });
  }
  loadClient(clientId: number): void {
    // Assuming clientsData is your JSON data
    this.client = clientsData.find(client => client.id === clientId);
  }
  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
}
