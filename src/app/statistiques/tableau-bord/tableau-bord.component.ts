import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart } from 'chart.js/auto';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { SidebarClientComponent } from '../../sidebar-client/sidebar-client.component';


@Component({
  selector: 'app-tableau-bord',
  standalone: true,
  imports: [CommonModule, SidebarClientComponent, MyHeaderComponent],
  templateUrl: './tableau-bord.component.html',
  styleUrl: './tableau-bord.component.css',
})
export class TableauBordComponent implements OnInit {
  sidebarCollapsed = false;
  currentView: 'day' | 'week' | 'month' | 'year' = 'month';
  currentDate = new Date();
  currentPeriodLabel = '';
  
  // Stats pour le dashboard
  stats = {
    appointmentsTotal: 485,
    appointmentsToday: 23,
    appointmentsCancelled: 12,
    appointmentsNoResponse: 45,
    visitsTotal: 358,
    visitsCompleted: 243,
    visitsScheduled: 87,
    visitsSuspended: 28
  };
  
  // Alertes
  alerts = [
    {
      title: 'Salariés sans AS',
      description: '13 salariés sans aptitude spécifiée',
      time: 'Il y a 2 heures',
      severity: 'high',
      icon: 'fa-exclamation-triangle'
    },
    {
      title: 'Rendez-vous sans réponse',
      description: '45 rendez-vous sans réponse',
      time: 'Il y a 5 heures',
      severity: 'medium',
      icon: 'fa-clock'
    },
    {
      title: 'Visites en retard',
      description: '5 visites à programmer en urgence',
      time: 'Aujourd\'hui, 09:45',
      severity: 'high',
      icon: 'fa-calendar-times'
    },
    {
      title: 'Convocations à envoyer',
      description: '29 convocations prêtes à être envoyées',
      time: 'Hier, 16:30',
      severity: 'low',
      icon: 'fa-envelope'
    }
  ];
  
  // Activités récentes
  recentActivities = [
    {
      title: 'Nouveau rendez-vous',
      description: 'MANAS Louis - VIPP le 17/04/2025',
      time: 'Il y a 30 minutes',
      category: 'appointment',
      icon: 'fa-calendar-plus'
    },
    {
      title: 'Visite médicale complétée',
      description: 'DUBOIS Sophie - Apte avec restrictions',
      time: 'Il y a 2 heures',
      category: 'visit',
      icon: 'fa-user-md'
    },
    {
      title: 'Nouveau salarié ajouté',
      description: 'MARTIN Jean - ASTBTP MARSEILLE',
      time: 'Aujourd\'hui, 10:15',
      category: 'user',
      icon: 'fa-user-plus'
    },
    {
      title: 'Alerte système',
      description: 'Maintenance prévue le 30/04/2025',
      time: 'Hier, 14:22',
      category: 'alert',
      icon: 'fa-bell'
    }
  ];
  
  // Top clients
  topClients = [
    {
      name: 'ASSYSTEM',
      employees: 120,
      visits: 84,
      value: '92%'
    },
    {
      name: 'BPALC',
      employees: 95,
      visits: 76,
      value: '88%'
    },
    {
      name: 'BPGO',
      employees: 65,
      visits: 47,
      value: '85%'
    },
    {
      name: 'BPS',
      employees: 42,
      visits: 29,
      value: '82%'
    },
    {
      name: 'ASTBTP MARSEILLE',
      employees: 56,
      visits: 34,
      value: '78%'
    }
  ];
  
  constructor() {
    this.updatePeriodLabel();
  }
  
  ngOnInit() {
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }
  
  initializeCharts() {
    // Graphique des rendez-vous
    const appointmentsCtx = document.getElementById('appointmentsChart') as HTMLCanvasElement;
    if (appointmentsCtx) {
      new Chart(appointmentsCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          datasets: [{
            label: 'Rendez-vous programmés',
            data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
            fill: false,
            borderColor: '#4285f4',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    
    // Graphique des visites
    const visitsCtx = document.getElementById('visitsChart') as HTMLCanvasElement;
    if (visitsCtx) {
      new Chart(visitsCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Visites effectuées',
            data: [45, 39, 60, 51, 36, 25],
            backgroundColor: '#4CAF50'
          }, {
            label: 'Visites programmées',
            data: [25, 29, 30, 41, 26, 35],
            backgroundColor: '#FF9800'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    
    // Graphique des statuts de visites
    const visitsStatusCtx = document.getElementById('visitsStatusChart') as HTMLCanvasElement;
    if (visitsStatusCtx) {
      new Chart(visitsStatusCtx, {
        type: 'doughnut',
        data: {
          labels: ['Effectuées', 'Programmées', 'Suspendues', 'Sans AS'],
          datasets: [{
            data: [243, 87, 28, 13],
            backgroundColor: [
              '#4CAF50',
              '#FF9800',
              '#F44336',
              '#9E9E9E'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    }
  }
  
  changeView(view: 'day' | 'week' | 'month' | 'year') {
    this.currentView = view;
    this.updatePeriodLabel();
    // Recharger les données en fonction de la vue
  }
  
  previousPeriod() {
    switch (this.currentView) {
      case 'day':
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        break;
      case 'week':
        this.currentDate.setDate(this.currentDate.getDate() - 7);
        break;
      case 'month':
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        break;
      case 'year':
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        break;
    }
    this.updatePeriodLabel();
    // Recharger les données en fonction de la nouvelle période
  }
  
  nextPeriod() {
    switch (this.currentView) {
      case 'day':
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        break;
      case 'week':
        this.currentDate.setDate(this.currentDate.getDate() + 7);
        break;
      case 'month':
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        break;
      case 'year':
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        break;
    }
    this.updatePeriodLabel();
    // Recharger les données en fonction de la nouvelle période
  }
  
  updatePeriodLabel() {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    switch (this.currentView) {
      case 'day':
        this.currentPeriodLabel = `${days[this.currentDate.getDay()]} ${this.currentDate.getDate()} ${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        break;
      case 'week':
        // Déterminer la date du lundi de la semaine courante
        const mondayDate = new Date(this.currentDate);
        const dayOfWeek = this.currentDate.getDay() || 7; // Convertir 0 (dimanche) en 7
        mondayDate.setDate(this.currentDate.getDate() - dayOfWeek + 1);
        
        // Déterminer la date du dimanche
        const sundayDate = new Date(mondayDate);
        sundayDate.setDate(mondayDate.getDate() + 6);
        
        // Formater: "Semaine du 1 au 7 avril 2025"
        this.currentPeriodLabel = `Semaine du ${mondayDate.getDate()} au ${sundayDate.getDate()} ${months[sundayDate.getMonth()]} ${sundayDate.getFullYear()}`;
        break;
      case 'month':
        this.currentPeriodLabel = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        break;
      case 'year':
        this.currentPeriodLabel = `${this.currentDate.getFullYear()}`;
        break;
    }
  }
  
  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
}
