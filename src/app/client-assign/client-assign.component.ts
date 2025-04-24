import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, Employee, MedicalVisit, MedicalAppointment } from '../models/client.model';
import { ClientService } from '../authservice/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-client-assign',
  standalone: true,
  imports: [CommonModule, FormsModule,MatIconModule], // Import CommonModule and FormsModule
  templateUrl: './client-assign.component.html',
  styleUrls: ['./client-assign.component.css']
})
export class ClientAssignComponent implements OnInit {
applyStatusFilter(arg0: string) {
throw new Error('Method not implemented.');
}
planification() {
throw new Error('Method not implemented.');
}
nouvelleVisite() {
throw new Error('Method not implemented.');
}
nouveauRDV() {
throw new Error('Method not implemented.');
}
  client: any;
  currentEmployee: any;
  employees: any[] = [];
  currentEmployeeIndex: number = 0;

  searchTerm: string = '';
  selectedCentreMedical: string = '';
  selectedAdhesion: string = '';
  selectedAssistante: string = '';
  selectedTypeVisite: string = '';
  selectedEtablissement: string = '';
  selectedTypeSuiviVisite: string = '';
centreMedicaux: any;
adhesions: any;
assistantes: any;
typesVisites: any;
etablissements: any;
typesSuiviVisites: any;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadClientData(id);
  }

  loadClientData(id: number): void {
    this.clientService.getClientById(id).subscribe((client) => {
      this.client = client;
      this.employees = client.employees || [];
      if (this.employees.length > 0) {
        this.currentEmployee = this.employees[0];
      }
    });
  }

  navigatePrevious(): void {
    if (this.currentEmployeeIndex > 0) {
      this.currentEmployeeIndex--;
      this.currentEmployee = this.employees[this.currentEmployeeIndex];
    }
  }

  navigateNext(): void {
    if (this.currentEmployeeIndex < this.employees.length - 1) {
      this.currentEmployeeIndex++;
      this.currentEmployee = this.employees[this.currentEmployeeIndex];
    }
  }

  applyFilters(): void {
    console.log('Filters applied:', {
      centreMedical: this.selectedCentreMedical,
      adhesion: this.selectedAdhesion,
      assistante: this.selectedAssistante,
      typeVisite: this.selectedTypeVisite,
      etablissement: this.selectedEtablissement,
      typeSuiviVisite: this.selectedTypeSuiviVisite,
    });
    // Implement filtering logic here
  }

  sendEmail(recipientType: string): void {
    console.log('Sending email to:', recipientType);
    this.clientService.sendEmail(this.currentEmployee.id, recipientType).subscribe((response) => {
      console.log('Email sent:', response);
    });
  }

  reportIncident(): void {
    const incidentDetails = prompt('Enter incident details');
    if (incidentDetails) {
      this.clientService.reportIncident(this.currentEmployee.id, incidentDetails).subscribe((response) => {
        console.log('Incident reported:', response);
      });
    }
  }

  createVisit(): void {
    const visitDetails = {
      type: 'Medical Checkup',
      status: 'Programmé',
      scheduled_date: new Date().toISOString().split('T')[0],
    };
    this.clientService.createVisit(this.currentEmployee.id, visitDetails).subscribe((response) => {
      console.log('Visit created:', response);
    });
  }

  searchEmployees(): void {
    console.log('Searching for:', this.searchTerm);
    // Implement search logic here
  }

  clearSearch(): void {
    this.searchTerm = '';
    console.log('Search cleared');
    // Reset filters or search results
  }
}