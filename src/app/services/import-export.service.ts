import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ImportTemplateInfo {
  id: string;
  name: string;
  formats: string[];
}

export interface ImportHistoryItem {
  id: number;
  type: string;
  file_name: string;
  status: string;
  records_processed: number;
  errors: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {
  private apiUrl = 'http://localhost:8000/api/import-export';

  constructor(private http: HttpClient) { }

  // Import file
  importFile(file: File, type: string, clientId?: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    if (clientId) {
      formData.append('client_id', clientId.toString());
    }

    return this.http.post<any>(`${this.apiUrl}/import`, formData).pipe(
      map(response => {
        // If the API returns a data property, extract it
        return response.data ? response.data : response;
      }),
      catchError(this.handleError<any>('importFile'))
    );
  }

  // Export data
  exportData(type: string, format: string, filters?: any): Observable<Blob> {
    let url = `${this.apiUrl}/export/${type}/${format}`;

    return this.http.post(url, { filters: filters || {} }, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError<Blob>('exportData'))
    );
  }

  // Get available import templates
  getTemplates(): Observable<ImportTemplateInfo[]> {
    return this.http.get<any>(`${this.apiUrl}/templates`).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const templates = response.data ? response.data : response;
        return templates as ImportTemplateInfo[];
      }),
      catchError(this.handleError<ImportTemplateInfo[]>('getTemplates', []))
    );
  }

  // Download template
  downloadTemplate(templateId: string, format: string): Observable<Blob> {
    const url = `${this.apiUrl}/templates/${templateId}/${format}`;

    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError<Blob>('downloadTemplate'))
    );
  }

  // Validate import file before importing
  validateImportFile(file: File, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<any>(`${this.apiUrl}/validate`, formData).pipe(
      map(response => {
        // If the API returns a data property, extract it
        return response.data ? response.data : response;
      }),
      catchError(this.handleError<any>('validateImportFile'))
    );
  }

  // Get import/export history
  getHistory(limit?: number, offset?: number): Observable<{ history: ImportHistoryItem[], total: number }> {
    let params = new HttpParams();

    if (limit) {
      params = params.append('limit', limit.toString());
    }

    if (offset !== undefined) {
      params = params.append('offset', offset.toString());
    }

    return this.http.get<any>(`${this.apiUrl}/history`, { params }).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const data = response.data ? response.data : response;
        return {
          history: data.history || [],
          total: data.total || 0
        };
      }),
      catchError(this.handleError<{ history: ImportHistoryItem[], total: number }>('getHistory', { history: [], total: 0 }))
    );
  }

  // Helper function to save a blob as file
  saveBlobAsFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Log the error to console
      console.error(`${operation} failed: ${error.message}`);
      console.error('Server error:', error);

      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
