import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { FormsModule } from '@angular/forms';

import Chart from 'chart.js/auto';
interface VisitDetail {
  type: string;
  scheduled: number;
  completed: number;
  cancelled: number;
  noResponse: number;
  total: number;
  completionRate: number;
}

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarClientComponent],
  templateUrl: './statistiques.component.html',
  styleUrl: './statistiques.component.css',
})
export class StatistiquesComponent implements OnInit {
  sidebarCollapsed = false;
  currentView: 'month' | 'quarter' | 'year' = 'month';
  currentDate = new Date();
  currentPeriodLabel = '';
  
  clients = [
    { id: 1, name: 'ASSYSTEM' },
    { id: 2, name: 'BPALC' },
    { id: 3, name: 'BPGO' },
    { id: 4, name: 'BPS' }
  ];
  
  filters = {
    client: '',
    visitType: ''
  };
  
  generalStats = {
    totalVisits: 3876,
    totalEmployees: 1245,
    totalClients: 48,
    completionRate: 87
  };
  
  visitDetailsData: VisitDetail[] = [
    {
      type: 'VIPP',
      scheduled: 524,
      completed: 458,
      cancelled: 45,
      noResponse: 21,
      total: 524,
      completionRate: 87
    },
    {
      type: 'VIPI',
      scheduled: 312,
      completed: 285,
      cancelled: 20,
      noResponse: 7,
      total: 312,
      completionRate: 91
    },
    {
      type: 'SIR A',
      scheduled: 198,
      completed: 165,
      cancelled: 22,
      noResponse: 11,
      total: 198,
      completionRate: 83
    },
    {
      type: 'SIR B',
      scheduled: 245,
      completed: 215,
      cancelled: 18,
      noResponse: 12,
      total: 245,
      completionRate: 88
    }
  ];
  
  private charts: { [key: string]: Chart } = {};
  
  constructor() {
    this.updatePeriodLabel();
  }
  
  ngOnInit() {
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }
  
  initializeCharts() {
    // Répartition des visites par type
    const visitTypeCtx = document.getElementById('visitTypeChart') as HTMLCanvasElement;
    if (visitTypeCtx) {
      this.charts['visitType'] = new Chart(visitTypeCtx, {
        type: 'pie',
        data: {
          labels: this.visitDetailsData.map(d => d.type),
          datasets: [{
            data: this.visitDetailsData.map(d => d.total),
            backgroundColor: [
              '#4285F4',
              '#34A853',
              '#FBBC05',
              '#EA4335'
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
    
    // Évolution mensuelle des visites
    const visitsOverTimeCtx = document.getElementById('visitsOverTimeChart') as HTMLCanvasElement;
    if (visitsOverTimeCtx) {
      this.charts['visitsOverTime'] = new Chart(visitsOverTimeCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          datasets: [{
            label: 'Programmées',
            data: [120, 145, 160, 185, 175, 190, 200, 180, 170, 195, 210, 225],
            borderColor: '#4285F4',
            backgroundColor: 'rgba(66, 133, 244, 0.1)',
            fill: true
          }, {
            label: 'Effectuées',
            data: [105, 128, 145, 165, 157, 168, 175, 159, 147, 173, 192, 203],
            borderColor: '#34A853',
            backgroundColor: 'rgba(52, 168, 83, 0.1)',
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
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
    
    // Répartition par statut
    const statusDistributionCtx = document.getElementById('statusDistributionChart') as HTMLCanvasElement;
    if (statusDistributionCtx) {
      this.charts['statusDistribution'] = new Chart(statusDistributionCtx, {
        type: 'doughnut',
        data: {
          labels: ['Effectuées', 'Annulées', 'Sans Réponse'],
          datasets: [{
            data: [
              this.getTotalForColumn('completed'),
              this.getTotalForColumn('cancelled'),
              this.getTotalForColumn('noResponse')
            ],
            backgroundColor: [
              '#34A853',
              '#EA4335',
              '#FBBC05'
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
    
    // Top 5 clients
    const topClientsCtx = document.getElementById('topClientsChart') as HTMLCanvasElement;
    if (topClientsCtx) {
      this.charts['topClients'] = new Chart(topClientsCtx, {
        type: 'bar',
        data: {
          labels: ['ASSYSTEM', 'BPALC', 'BPGO', 'BPS', 'ASTBTP MARSEILLE'],
          datasets: [{
            label: 'Nombre de visites',
            data: [485, 365, 290, 245, 215],
            backgroundColor: '#4285F4'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  
  changeView(view: 'month' | 'quarter' | 'year') {
    this.currentView = view;
    this.updatePeriodLabel();
    // Mise à jour des données selon la vue
    this.updateCharts();
  }
  
  previousPeriod() {
    switch (this.currentView) {
      case 'month':
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        break;
      case 'quarter':
        this.currentDate.setMonth(this.currentDate.getMonth() - 3);
        break;
      case 'year':
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        break;
    }
    this.updatePeriodLabel();
    this.updateCharts();
  }
  
  nextPeriod() {
    switch (this.currentView) {
      case 'month':
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        break;
      case 'quarter':
        this.currentDate.setMonth(this.currentDate.getMonth() + 3);
        break;
      case 'year':
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        break;
    }
    this.updatePeriodLabel();
    this.updateCharts();
  }
  
  updatePeriodLabel() {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    switch (this.currentView) {
      case 'month':
        this.currentPeriodLabel = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        break;
      case 'quarter':
        // Déterminer le trimestre actuel (1-4)
        const quarter = Math.floor(this.currentDate.getMonth() / 3) + 1;
        this.currentPeriodLabel = `T${quarter} ${this.currentDate.getFullYear()}`;
        break;
      case 'year':
        this.currentPeriodLabel = `${this.currentDate.getFullYear()}`;
        break;
    }
  }
  
  updateCharts() {
    // Simuler une mise à jour des données et des graphiques
    // Dans une application réelle, vous feriez un appel API avec les paramètres de la période
    
    // Puis mise à jour des graphiques
    if (this.charts['visitsOverTime']) {
      this.charts['visitsOverTime'].update();
    }
    
    if (this.charts['visitType']) {
      this.charts['visitType'].update();
    }
    
    if (this.charts['statusDistribution']) {
      this.charts['statusDistribution'].update();
    }
    
    if (this.charts['topClients']) {
      this.charts['topClients'].update();
    }
  }
  
  applyFilters() {
    // Appliquer les filtres et mettre à jour les statistiques et graphiques
    console.log('Filtres appliqués:', this.filters);
    
    // Ici, vous feriez un appel API avec les filtres
    // Puis mise à jour des données et des graphiques
    
    // Simuler une mise à jour
    if (this.filters.client) {
      // Réduire les valeurs pour simuler un filtre
      this.visitDetailsData.forEach(data => {
        data.scheduled = Math.floor(data.scheduled * 0.7);
        data.completed = Math.floor(data.completed * 0.7);
        data.cancelled = Math.floor(data.cancelled * 0.7);
        data.noResponse = Math.floor(data.noResponse * 0.7);
        data.total = data.scheduled;
        data.completionRate = Math.round((data.completed / data.total) * 100);
      });
      
      this.generalStats.totalVisits = this.getTotalForColumn('total');
      this.generalStats.totalEmployees = Math.floor(this.generalStats.totalEmployees * 0.7);
      this.generalStats.completionRate = this.getAverageCompletionRate();
    } else {
      // Réinitialiser les données initiales
      this.visitDetailsData = [
        {
          type: 'VIPP',
          scheduled: 524,
          completed: 458,
          cancelled: 45,
          noResponse: 21,
          total: 524,
          completionRate: 87
        },
        {
          type: 'VIPI',
          scheduled: 312,
          completed: 285,
          cancelled: 20,
          noResponse: 7,
          total: 312,
          completionRate: 91
        },
        {
          type: 'SIR A',
          scheduled: 198,
          completed: 165,
          cancelled: 22,
          noResponse: 11,
          total: 198,
          completionRate: 83
        },
        {
          type: 'SIR B',
          scheduled: 245,
          completed: 215,
          cancelled: 18,
          noResponse: 12,
          total: 245,
          completionRate: 88
        }
      ];
      
      this.generalStats.totalVisits = 3876;
      this.generalStats.totalEmployees = 1245;
      this.generalStats.completionRate = 87;
    }
    
    // Mettre à jour les graphiques
    this.updateCharts();
  }
  
  getTotalForColumn(column: keyof VisitDetail): number {
    return this.visitDetailsData.reduce((sum, data) => sum + Number(data[column]), 0);
  }
  
  getAverageCompletionRate(): number {
    const totalCompleted = this.getTotalForColumn('completed');
    const totalScheduled = this.getTotalForColumn('scheduled');
    return Math.round((totalCompleted / totalScheduled) * 100);
  }
  
  exportData(format: 'pdf' | 'xlsx' | 'csv') {
    // Ici, vous implémenteriez la logique d'exportation réelle
    console.log(`Exporting data to ${format} format`);
    
    // Simuler un téléchargement
    const fileName = `statistiques_${this.currentPeriodLabel.replace(/ /g, '_')}.${format}`;
    alert(`Exportation réussie! Fichier: ${fileName}`);
  }
  
  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
}
