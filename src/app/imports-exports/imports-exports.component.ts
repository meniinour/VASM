import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';

@Component({
  selector: 'app-imports-exports',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarClientComponent],
  templateUrl: './imports-exports.component.html',
  styleUrls: ['./imports-exports.component.css']
})
export class ImportsExportsComponent {
  sidebarCollapsed = false;
  activeTab: 'import' | 'export' | 'impressions' = 'import';

  dragActive = false;
  selectedFile: File | null = null;

  exportType: string = 'salaries';
  exportClientId: string = '';
  exportFormat: string = 'xlsx';
  exportDateFrom: string = '';
  exportDateTo: string = '';

  documentType: string = 'convocations';
  documentClientId: string = '';
  documentEmployeeId: string = '';
  documentDateFrom: string = '';
  documentDateTo: string = '';

  clients = [
    { id: 1, name: 'ASSYSTEM' },
    { id: 2, name: 'BPALC' },
    { id: 3, name: 'BPGO' },
    { id: 4, name: 'BPS' }
  ];

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  setActiveTab(tab: 'import' | 'export' | 'impressions') {
    this.activeTab = tab;
  }

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

  importFile() {
    if (!this.selectedFile) return;
    alert(`Fichier ${this.selectedFile.name} importé avec succès!`);
    this.removeFile();
  }

  exportData() {
    alert(`Exportation des données de type ${this.exportType} au format ${this.exportFormat}`);
  }

  printDocument() {
    alert(`Impression du document: ${this.documentType}`);
  }
}
