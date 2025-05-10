// src/app/services/import-export.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {
  private apiUrl = 'http://localhost:8000/api/import-export';

  constructor(private http: HttpClient) { }

  /**
   * Import data from a file
   * @param file The file to import
   * @param type Type of data being imported (visits, clients, etc.)
   * @param clientId Optional client ID to associate with the import
   */
  importFile(file: File, type: string, clientId?: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    if (clientId) {
      formData.append('client_id', clientId.toString());
    }

    return this.http.post<any>(`${this.apiUrl}/import`, formData);
  }

  /**
   * Export data to a specific format
   * @param type Type of data to export (visits, clients, employees, etc.)
   * @param format Format to export to (pdf, xlsx, csv)
   * @param filters Filters to apply to the exported data
   */
  exportData(type: string, format: string, filters: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export/${type}/${format}`, filters, {
      responseType: 'blob'
    });
  }

  /**
   * Download a blob as a file
   * @param blob The blob to download
   * @param filename Name for the downloaded file
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * Get a list of templates available for import
   */
  getImportTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/templates`);
  }

  /**
   * Download an import template
   * @param templateId ID of the template to download
   * @param format Format of the template (xlsx, csv)
   */
  downloadImportTemplate(templateId: string, format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/templates/${templateId}/${format}`, {
      responseType: 'blob'
    });
  }

  /**
   * Validate an import file before committing it
   * @param file The file to validate
   * @param type Type of data being validated
   */
  validateImportFile(file: File, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<any>(`${this.apiUrl}/validate`, formData);
  }

  /**
   * Get import history
   * @param limit Number of history items to return
   * @param offset Offset for pagination
   */
  getImportHistory(limit: number = 10, offset: number = 0): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/history?limit=${limit}&offset=${offset}`);
  }

  /**
   * Schedule a recurring export
   * @param schedule Schedule configuration
   */
  scheduleExport(schedule: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/schedule`, schedule);
  }

  /**
   * Get list of scheduled exports
   */
  getScheduledExports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/schedule`);
  }

  /**
   * Delete a scheduled export
   * @param scheduleId ID of the schedule to delete
   */
  deleteScheduledExport(scheduleId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/schedule/${scheduleId}`);
  }
}
