import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { ImportExportService } from '../services/import-export.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-imports-exports',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarClientComponent, MyHeaderComponent],
  templateUrl: './imports-exports.component.html',
  styleUrls: ['./imports-exports.component.css']
})
export class ImportsExportsComponent implements OnInit {
  // UI state
  sidebarCollapsed = false;
  activeTab: 'import' | 'export' | 'impressions' = 'import';

  // File upload
  dragActive = false;
  selectedFile: File | null = null;

  // Export settings
  exportType: string = 'salaries';
  exportClientId: string = '';
  exportFormat: string = 'xlsx';
  exportDateFrom: string = '';
  exportDateTo: string = '';

  // Document settings
  documentType: string = 'convocations';
  documentClientId: string = '';
  documentEmployeeId: string = '';
  documentDateFrom: string = '';
  documentDateTo: string = '';

  // Client list for dropdowns
  clients = [
    { id: 1, name: 'ASSYSTEM' },
    { id: 2, name: 'BPALC' },
    { id: 3, name: 'BPGO' },
    { id: 4, name: 'BPS' }
  ];

  constructor(
    private importExportService: ImportExportService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    // Load clients for dropdowns
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        // Show error message
      }
    });
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  setActiveTab(tab: 'import' | 'export' | 'impressions') {
    this.activeTab = tab;
  }

  // File upload drag and drop handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (this.isValidFile(file)) {
        this.selectedFile = file;
      }
    }
  }

  triggerFileInput() {
    document.getElementById('file-upload')?.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isValidFile(file)) {
        this.selectedFile = file;
      }
    }
  }

  isValidFile(file: File): boolean {
    const allowedTypes = ['.csv', '.xlsx'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    return allowedTypes.includes(extension);
  }

  removeFile() {
    this.selectedFile = null;
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Import file
  importFile() {
    if (!this.selectedFile) return;

    this.importExportService.importFile(this.selectedFile, 'employees', this.exportClientId ? parseInt(this.exportClientId) : undefined).subscribe({
      next: (response) => {
        alert(`Fichier ${this.selectedFile!.name} importé avec succès! ${response.imported} enregistrements importés.`);
        this.removeFile();
      },
      error: (error) => {
        console.error('Error importing file:', error);
        alert(`Erreur lors de l'importation du fichier: ${error.message}`);
      }
    });
  }

  // Export data
  exportData() {
    // Prepare filters
    const filters: any = {};

    if (this.exportClientId) {
      filters.client_id = this.exportClientId;
    }

    if (this.exportDateFrom) {
      filters.date_from = this.exportDateFrom;
    }

    if (this.exportDateTo) {
      filters.date_to = this.exportDateTo;
    }

    this.importExportService.exportData(
      this.exportType,
      this.exportFormat as any,
      filters
    ).subscribe({
      next: (blob) => {
        // Download the file
        const filename = `${this.exportType}_${new Date().toISOString().slice(0, 10)}.${this.exportFormat}`;
        this.importExportService.downloadFile(blob, filename);
      },
      error: (error) => {
        console.error('Error exporting data:', error);
        alert(`Erreur lors de l'exportation: ${error.message}`);
      }
    });
  }

  // Print document
  printDocument() {
    // Prepare filters
    const filters: any = {};

    if (this.documentClientId) {
      filters.client_id = this.documentClientId;
    }

    if (this.documentEmployeeId) {
      filters.employee_id = this.documentEmployeeId;
    }

    if (this.documentDateFrom) {
      filters.date_from = this.documentDateFrom;
    }

    if (this.documentDateTo) {
      filters.date_to = this.documentDateTo;
    }

    // Map document type to an export type
    let exportType: string;
    switch (this.documentType) {
      case 'convocations':
        exportType = 'appointments';
        break;
      case 'fiches':
        exportType = 'visits';
        break;
      case 'attestations':
        exportType = 'employees';
        break;
      case 'rapports':
        exportType = 'statistics';
        break;
      default:
        exportType = 'employees';
    }

    this.importExportService.exportData(
      exportType,
      'pdf',
      filters
    ).subscribe({
      next: (blob) => {
        // Open in new window for printing
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error) => {
        console.error('Error printing document:', error);
        alert(`Erreur lors de l'impression: ${error.message}`);
      }
    });
  }
}
