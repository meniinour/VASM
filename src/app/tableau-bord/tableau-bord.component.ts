// src/app/tableau-bord/tableau-bord.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { Chart } from 'chart.js/auto';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { StatisticsService, StatsPeriod } from '../services/statistics.service';
import { VisitService } from '../services/visit.service';
import { AppointmentService } from '../services/appointment.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-tableau-bord',
  standalone: true,
  imports: [CommonModule, SidebarClientComponent, MyHeaderComponent],
  templateUrl: './tableau-bord.component.html',
  styleUrl: './tableau-bord.component.css',
})
export class TableauBordComponent implements OnInit {
  // UI state
  sidebarCollapsed = false;
  currentView: 'day' | 'week' | 'month' | 'year' = 'month';
  currentDate = new Date();
  currentPeriodLabel = '';

  // Stats for the dashboard
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

  // Charts
  charts = {
    appointmentsChart: null as Chart | null,
    visitsChart: null as Chart | null,
    visitsStatusChart: null as Chart | null
  };

  // Alerts
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

  // Recent activities
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

  constructor(
    private statisticsService: StatisticsService,
    private visitService: VisitService,
    private appointmentService: AppointmentService,
    private clientService: ClientService
  ) {
    this.updatePeriodLabel();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Create period object based on current view and date
    const period: StatsPeriod = {
      type: this.adaptViewToPeriodType(this.currentView),
      start: this.getStartDateString(),
      end: this.getEndDateString(),
      label: this.currentPeriodLabel
    };

    // Empty filters object for now, could be enhanced later
    const filters = {};

    this.statisticsService.getDashboardSummary(period, filters).subscribe({
      next: (data) => {
        // Update appointments stats
        this.stats.appointmentsTotal = data.appointments.total;
        this.stats.appointmentsToday = data.appointments.today;
        this.stats.appointmentsCancelled = data.appointments.cancelled;
        this.stats.appointmentsNoResponse = data.appointments.noResponse;

        // Update visits stats
        this.stats.visitsTotal = data.visits.total;
        this.stats.visitsCompleted = data.visits.completed;
        this.stats.visitsScheduled = data.visits.scheduled;
        this.stats.visitsSuspended = data.visits.suspended;

        // Update top clients
        this.topClients = data.clients.top;

        setTimeout(() => {
          this.initializeCharts(data);
        }, 100);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        // Use sample data on error
        setTimeout(() => {
          this.initializeCharts({
            appointments: {
              byPeriod: [
                { period: 'Jan', count: 65 },
                { period: 'Fév', count: 59 },
                { period: 'Mar', count: 80 },
                { period: 'Avr', count: 81 },
                { period: 'Mai', count: 56 },
                { period: 'Juin', count: 55 },
                { period: 'Juil', count: 40 },
                { period: 'Août', count: 45 },
                { period: 'Sep', count: 60 },
                { period: 'Oct', count: 70 },
                { period: 'Nov', count: 85 },
                { period: 'Déc', count: 90 }
              ]
            },
            visits: {
              byType: [
                { type: 'VIPP', count: 45 },
                { type: 'VIPI', count: 39 },
                { type: 'SIR A', count: 60 },
                { type: 'SIR B', count: 51 },
                { type: 'SIA', count: 36 },
                { type: 'SIS', count: 25 }
              ],
              byStatus: [
                { status: 'Effectuées', count: 243 },
                { status: 'Programmées', count: 87 },
                { status: 'Suspendues', count: 28 },
                { status: 'Sans AS', count: 13 }
              ]
            }
          });
        }, 100);
      }
    });

    // Load recent activities
    this.loadRecentActivities();

    // Load alerts
    this.loadAlerts();
  }

  adaptViewToPeriodType(view: 'day' | 'week' | 'month' | 'year'): 'month' | 'quarter' | 'year' {
    // Convert our view types to the ones accepted by StatsPeriod
    switch(view) {
      case 'day':
      case 'week':
      case 'month':
        return 'month';
      case 'year':
        return 'year';
      default:
        return 'month';
    }
  }

  loadRecentActivities(): void {
    // For activities, we might need to combine data from different sources
    // This would typically call a specific API endpoint to get recent activities
    // For now, we'll keep the default activities

    // Example of how to add new activities if we had an API:
    /*
    this.http.get<any[]>('/api/activities/recent').subscribe({
      next: (activities) => {
        if (activities && activities.length > 0) {
          this.recentActivities = activities;
        }
      },
      error: (error) => {
        console.error('Error loading recent activities:', error);
      }
    });
    */
  }

  loadAlerts(): void {
    // This would typically call a specific API endpoint to get alerts
    // For now, we'll keep the default alerts

    // Example of how to add new alerts if we had an API:
    /*
    this.http.get<any[]>('/api/alerts').subscribe({
      next: (alerts) => {
        if (alerts && alerts.length > 0) {
          this.alerts = alerts;
        }
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
      }
    });
    */
  }

  getTimeDifference(date: Date): string {
    const now = new Date();
    const diffMs = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    }
  }

  getStartDateString(): string {
    let date = new Date(this.currentDate);

    switch (this.currentView) {
      case 'day':
        // No adjustment needed
        break;
      case 'week':
        // Get first day of the week
        const day = date.getDay() || 7; // Convert Sunday (0) to 7
        date.setDate(date.getDate() - (day - 1));
        break;
      case 'month':
        date.setDate(1);
        break;
      case 'year':
        date.setMonth(0);
        date.setDate(1);
        break;
    }

    return date.toISOString().split('T')[0];
  }

  getEndDateString(): string {
    let date = new Date(this.currentDate);

    switch (this.currentView) {
      case 'day':
        // No adjustment needed
        break;
      case 'week':
        // Get first day of the week
        const day = date.getDay() || 7; // Convert Sunday (0) to 7
        date.setDate(date.getDate() - (day - 1) + 6); // Add 6 days to get to Sunday
        break;
      case 'month':
        // Go to next month, then back one day
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        break;
      case 'year':
        date.setMonth(11);
        date.setDate(31);
        break;
    }

    return date.toISOString().split('T')[0];
  }

  initializeCharts(data: any): void {
    // Appointments chart
    const appointmentsCtx = document.getElementById('appointmentsChart') as HTMLCanvasElement;
    if (appointmentsCtx) {
      if (this.charts.appointmentsChart) {
        this.charts.appointmentsChart.destroy();
      }

      this.charts.appointmentsChart = new Chart(appointmentsCtx, {
        type: 'line',
        data: {
          labels: data.appointments.byPeriod.map((item: any) => item.period),
          datasets: [{
            label: 'Rendez-vous programmés',
            data: data.appointments.byPeriod.map((item: any) => item.count),
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

    // Visits chart
    const visitsCtx = document.getElementById('visitsChart') as HTMLCanvasElement;
    if (visitsCtx) {
      if (this.charts.visitsChart) {
        this.charts.visitsChart.destroy();
      }

      this.charts.visitsChart = new Chart(visitsCtx, {
        type: 'bar',
        data: {
          labels: data.visits.byType.map((item: any) => item.type),
          datasets: [{
            label: 'Visites effectuées',
            data: data.visits.byType.map((item: any) => item.count),
            backgroundColor: '#4CAF50'
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

    // Visits status chart
    const visitsStatusCtx = document.getElementById('visitsStatusChart') as HTMLCanvasElement;
    if (visitsStatusCtx) {
      if (this.charts.visitsStatusChart) {
        this.charts.visitsStatusChart.destroy();
      }

      this.charts.visitsStatusChart = new Chart(visitsStatusCtx, {
        type: 'doughnut',
        data: {
          labels: data.visits.byStatus.map((item: any) => item.status),
          datasets: [{
            data: data.visits.byStatus.map((item: any) => item.count),
            backgroundColor: [
              '#4CAF50', // Effectuées
              '#FF9800', // Programmées
              '#F44336', // Suspendues
              '#9E9E9E'  // Sans AS
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
    this.loadDashboardData();
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
    this.loadDashboardData();
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
    this.loadDashboardData();
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
