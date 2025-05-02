// employee-dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MyHeaderComponent } from "../my-header/my-header.component";
import { DocumentationComponent } from "../documentation/documentation.component";

interface Appointment {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description: string;
  status: 'pending' | 'approved' | 'modified';
}


@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [CommonModule, FormsModule, MyHeaderComponent, DocumentationComponent],
   templateUrl: './employe.component.html',
  styleUrl: './employe.component.css'
})
export class EmployeComponent  implements OnInit {
  employeeName: string = 'Thomas Dubois';
  companyName: string = 'Tech Solutions SA';
  notificationCount: number = 3;
  showProfileMenu: boolean = false;
  appointments: Appointment[] = [];
  viewMode: 'day' | 'week' | 'month' = 'week';
  selectedDate: Date = new Date();

  ngOnInit() {
    // Simuler le chargement des rendez-vous depuis un service
    this.loadAppointments();
  }

  loadAppointments() {
    // Simulation de données - à remplacer par un appel API réel
    this.appointments = [
      {
        id: 1,
        title: 'Réunion d\'équipe',
        date: new Date(2025, 3, 26, 10, 0),
        startTime: '10:00',
        endTime: '11:30',
        description: 'Discussion sur le nouveau projet',
        status: 'pending'
      },
      {
        id: 2,
        title: 'Appel client',
        date: new Date(2025, 3, 26, 14, 0),
        startTime: '14:00',
        endTime: '15:00',
        description: 'Présentation du prototype',
        status: 'approved'
      },
      {
        id: 3,
        title: 'Formation Angular',
        date: new Date(2025, 3, 27, 9, 0),
        startTime: '09:00',
        endTime: '12:00',
        description: 'Session de formation interne',
        status: 'pending'
      }
    ];
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    setTimeout(() => {}, 0);
  }

  logout() {
    // Logique de déconnexion
    console.log('Déconnexion...');
  }

  approveAppointment(appointmentId: number) {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = 'approved';
    }
  }

  modifyAppointment(appointmentId: number) {
    console.log('Modification du rendez-vous:', appointmentId);
    // Ouvrir un modal pour modifier le rendez-vous
  }

  changeView(view: 'day' | 'week' | 'month') {
    this.viewMode = view;
  }

  previousPeriod() {
    const date = new Date(this.selectedDate);
    switch(this.viewMode) {
      case 'day':
        date.setDate(date.getDate() - 1);
        break;
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
    }
    this.selectedDate = date;
  }

  nextPeriod() {
    const date = new Date(this.selectedDate);
    switch(this.viewMode) {
      case 'day':
        date.setDate(date.getDate() + 1);
        break;
      case 'week':
        date.setDate(date.getDate() + 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() + 1);
        break;
    }
    this.selectedDate = date;
  }

  getFormattedDateRange(): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    
    if (this.viewMode === 'day') {
      return this.selectedDate.toLocaleDateString('fr-FR', options);
    } else if (this.viewMode === 'week') {
      const startOfWeek = new Date(this.selectedDate);
      const day = this.selectedDate.getDay();
      const diff = this.selectedDate.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('fr-FR', options)}`;
    } else {
      return this.selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    }
  }
}