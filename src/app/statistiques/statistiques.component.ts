import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { FormsModule } from '@angular/forms';
import { MyHeaderComponent } from '../my-header/my-header.component';
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

interface SortConfig {
  key: keyof VisitDetail;
  ascending: boolean;
}

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarClientComponent, MyHeaderComponent],
  templateUrl: './statistiques.component.html',
  styleUrl: './statistiques.component.css',
})
export class StatistiquesComponent implements OnInit, AfterViewInit {
  sidebarCollapsed = false;
  currentView: 'month' | 'quarter' | 'year' = 'month';
  currentDate = new Date();
  currentPeriodLabel = '';
  expandedTableView = false;
  activeChartFilter = 'all';
  
  // For math operations in template
  Math = Math;
  
  // Chart colors
  chartColors = [
    '#4285F4', '#34A853', '#FBBC05', '#EA4335', 
    '#1A73E8', '#0F9D58', '#F4B400', '#DB4437'
  ];
  
  // Sort configuration
  sortConfig: SortConfig = {
    key: 'type',
    ascending: true
  };
  
  // Client data
  clients = [
    { id: 1, name: 'ASSYSTEM' },
    { id: 2, name: 'BPALC' },
    { id: 3, name: 'BPGO' },
    { id: 4, name: 'BPS' },
    { id: 5, name: 'ASTBTP MARSEILLE' },
    { id: 6, name: 'COFIDIS' },
    { id: 7, name: 'ENEDIS' }
  ];
  
  // Filters
  filters = {
    client: '',
    visitType: '',
    period: 'current'
  };
  
  // General statistics
  generalStats = {
    totalVisits: 3876,
    totalEmployees: 1245,
    totalClients: 48,
    completionRate: 87
  };
  
  // Trend data (compared to previous period)
  trends = {
    visits: 8.4,
    completion: 2.3,
    cancellation: -1.5
  };
  
  // Top performing client
  topPerformer = 'ASSYSTEM';
  
  // Total visits for top 5 clients
  topClientsTotal = 1600;
  
  // Visit details data
  visitDetailsData: VisitDetail[] = [
    { type: 'VIPP', scheduled: 524, completed: 458, cancelled: 45, noResponse: 21, total: 524, completionRate: 87 },
    { type: 'VIPI', scheduled: 312, completed: 285, cancelled: 20, noResponse: 7, total: 312, completionRate: 91 },
    { type: 'SIR A', scheduled: 198, completed: 165, cancelled: 22, noResponse: 11, total: 198, completionRate: 83 },
    { type: 'SIR B', scheduled: 245, completed: 215, cancelled: 18, noResponse: 12, total: 245, completionRate: 88 }
  ];
  
  // Chart instances
  private visitTypeChart: Chart | null = null;
  private visitsOverTimeChart: Chart | null = null;
  private statusDistributionChart: Chart | null = null;
  private topClientsChart: Chart | null = null;
  
  // Computed property for sorted visit details data
  get sortedVisitDetailsData(): VisitDetail[] {
    return [...this.visitDetailsData].sort((a, b) => {
      const valueA = a[this.sortConfig.key];
      const valueB = b[this.sortConfig.key];
      
      const comparison = this.sortConfig.ascending ? 
        (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) : 
        (valueA > valueB ? -1 : valueA < valueB ? 1 : 0);
      
      return comparison;
    });
  }
  
  ngOnInit(): void {
    this.updatePeriodLabel();
  }
  
  ngAfterViewInit(): void {
    this.animateStatValues();
    this.initCharts();
  }
  
  // Animate stat values (replaces countUp directive)
  private animateStatValues(): void {
    this.animateValue('totalVisits', 0, this.generalStats.totalVisits, 1500);
    this.animateValue('totalEmployees', 0, this.generalStats.totalEmployees, 1500);
    this.animateValue('totalClients', 0, this.generalStats.totalClients, 1500);
    this.animateValue('completionRate', 0, this.generalStats.completionRate, 1500);
  }
  
  // Helper function to animate number counting
  private animateValue(elementId: string, start: number, end: number, duration: number): void {
    const elements = document.querySelectorAll(`.stat-value[data-id="${elementId}"]`);
    if (elements.length === 0) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(start + easedProgress * (end - start));
      
      elements.forEach(element => {
        element.textContent = currentValue.toString();
      });
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        elements.forEach(element => {
          element.textContent = end.toString();
        });
      }
    };
    
    window.requestAnimationFrame(step);
  }
  
  // Update period label based on current view and date
  updatePeriodLabel(): void {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    if (this.currentView === 'month') {
      this.currentPeriodLabel = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    } else if (this.currentView === 'quarter') {
      const quarter = Math.floor(this.currentDate.getMonth() / 3) + 1;
      this.currentPeriodLabel = `T${quarter} ${this.currentDate.getFullYear()}`;
    } else {
      this.currentPeriodLabel = `${this.currentDate.getFullYear()}`;
    }
  }
  
  // Navigation to previous period
  previousPeriod(): void {
    if (this.currentView === 'month') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    } else if (this.currentView === 'quarter') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 3, 1);
    } else {
      this.currentDate = new Date(this.currentDate.getFullYear() - 1, 0, 1);
    }
    
    this.updatePeriodLabel();
    this.refreshData();
  }
  
  // Navigation to next period
  nextPeriod(): void {
    if (this.currentView === 'month') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    } else if (this.currentView === 'quarter') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 3, 1);
    } else {
      this.currentDate = new Date(this.currentDate.getFullYear() + 1, 0, 1);
    }
    
    this.updatePeriodLabel();
    this.refreshData();
  }
  
  // Change the view mode (month, quarter, year)
  changeView(view: 'month' | 'quarter' | 'year'): void {
    this.currentView = view;
    this.updatePeriodLabel();
    this.refreshData();
  }
  
  // Apply filters to the data
  applyFilters(): void {
    console.log('Applied filters:', this.filters);
    this.refreshData();
    // Would typically call an API with the filters
  }
  
  // Refresh data
  refreshData(): void {
    console.log('Refreshing data for period:', this.currentPeriodLabel);
    // Simulate data loading - would typically be an API call
    setTimeout(() => {
      this.updateCharts();
    }, 300);
  }
  
  // Toggle table view (expanded/collapsed)
  toggleTableView(): void {
    this.expandedTableView = !this.expandedTableView;
  }
  
  // Filter chart data
  filterChart(filter: string): void {
    this.activeChartFilter = filter;
    this.updateCharts();
  }
  
  // Sort table by column
  sortTable(key: keyof VisitDetail): void {
    if (this.sortConfig.key === key) {
      this.sortConfig.ascending = !this.sortConfig.ascending;
    } else {
      this.sortConfig.key = key;
      this.sortConfig.ascending = true;
    }
  }
  
  // Get total for a specific column in visit details
  getTotalForColumn(column: keyof VisitDetail): number {
    return this.visitDetailsData.reduce((total, item) => total + Number(item[column]), 0);
  }
  
  // Calculate average completion rate
  getAverageCompletionRate(): number {
    const total = this.getTotalForColumn('scheduled');
    const completed = this.getTotalForColumn('completed');
    return Math.round((completed / total) * 100);
  }
  
  // Get class for completion bar
  getCompletionClass(rate: number): string {
    if (rate >= 85) return 'high';
    if (rate >= 70) return 'medium';
    return 'low';
  }
  
  // Export data in various formats
  exportData(format: 'pdf' | 'xlsx' | 'csv'): void {
    console.log(`Exporting data in ${format} format for ${this.currentPeriodLabel}`);
    // Would implement actual export functionality here
  }
  
  // Show visit details modal/page
  showVisitDetails(): void {
    console.log('Showing visit details');
    // Would implement navigation or modal opening here
  }
  
  // Show employee details modal/page
  showEmployeeDetails(): void {
    console.log('Showing employee details');
    // Would implement navigation or modal opening here
  }
  
  // Show client details modal/page
  showClientDetails(): void {
    console.log('Showing client details');
    // Would implement navigation or modal opening here
  }
  
  // Show completion details modal/page
  showCompletionDetails(): void {
    console.log('Showing completion rate details');
    // Would implement navigation or modal opening here
  }
  
  // Initialize all charts
  private initCharts(): void {
    this.initVisitTypeChart();
    this.initVisitsOverTimeChart();
    this.initStatusDistributionChart();
    this.initTopClientsChart();
  }
  
  // Initialize visit type chart (pie/doughnut)
  private initVisitTypeChart(): void {
    const ctx = document.getElementById('visitTypeChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    this.visitTypeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.visitDetailsData.map(item => item.type),
        datasets: [{
          data: this.visitDetailsData.map(item => item.completed),
          backgroundColor: this.chartColors.slice(0, this.visitDetailsData.length),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  // Initialize visits over time chart (line)
  private initVisitsOverTimeChart(): void {
    const ctx = document.getElementById('visitsOverTimeChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    // Sample monthly data
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthData = months.map((_, index) => {
      // Generate some sample data
      const baseValue = 150 + Math.floor(Math.random() * 100);
      const completed = baseValue - Math.floor(Math.random() * 40);
      return {
        month: months[index],
        scheduled: baseValue,
        completed: completed
      };
    });
    
    this.visitsOverTimeChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Programmées',
            data: monthData.map(item => item.scheduled),
            borderColor: '#1A73E8',
            backgroundColor: 'rgba(26, 115, 232, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Effectuées',
            data: monthData.map(item => item.completed),
            borderColor: '#34A853',
            backgroundColor: 'rgba(52, 168, 83, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(200, 200, 200, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  // Initialize status distribution chart (bar)
  private initStatusDistributionChart(): void {
    const ctx = document.getElementById('statusDistributionChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    this.statusDistributionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.visitDetailsData.map(item => item.type),
        datasets: [
          {
            label: 'Effectuées',
            data: this.visitDetailsData.map(item => item.completed),
            backgroundColor: '#34A853'
          },
          {
            label: 'Annulées',
            data: this.visitDetailsData.map(item => item.cancelled),
            backgroundColor: '#EA4335'
          },
          {
            label: 'Sans Réponse',
            data: this.visitDetailsData.map(item => item.noResponse),
            backgroundColor: '#FBBC05'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: 'rgba(200, 200, 200, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  // Initialize top clients chart (horizontal bar)
  private initTopClientsChart(): void {
    const ctx = document.getElementById('topClientsChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    // Sample top clients data
    const topClients = [
      { name: 'ASSYSTEM', visits: 520 },
      { name: 'BPALC', visits: 410 },
      { name: 'ENEDIS', visits: 320 },
      { name: 'COFIDIS', visits: 210 },
      { name: 'BPS', visits: 140 }
    ];
    
    this.topClientsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topClients.map(client => client.name),
        datasets: [{
          label: 'Visites',
          data: topClients.map(client => client.visits),
          backgroundColor: '#4285F4',
          borderRadius: 5
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(200, 200, 200, 0.1)'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  // Update all charts (called when filters or period changes)
  private updateCharts(): void {
    // Update visit type chart
    if (this.visitTypeChart) {
      this.visitTypeChart.data.datasets[0].data = this.visitDetailsData.map(item => item.completed);
      this.visitTypeChart.update();
    }
    
    // Update visits over time chart based on active filter
    if (this.visitsOverTimeChart) {
      // For a real app, would fetch new data based on filters
      this.visitsOverTimeChart.update();
    }
    
    // Update status distribution chart
    if (this.statusDistributionChart) {
      this.statusDistributionChart.data.datasets[0].data = this.visitDetailsData.map(item => item.completed);
      this.statusDistributionChart.data.datasets[1].data = this.visitDetailsData.map(item => item.cancelled);
      this.statusDistributionChart.data.datasets[2].data = this.visitDetailsData.map(item => item.noResponse);
      this.statusDistributionChart.update();
    }
    
    // Update top clients chart
    if (this.topClientsChart) {
      // For a real app, would fetch new data based on filters
      this.topClientsChart.update();
    }
  }
}