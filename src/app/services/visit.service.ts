import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  exportVisits(format: string, options: { employee_ids: any }): Observable<Blob> {
    const url = `${this.apiUrl}/export/${format}`;
    return this.http.post(url, options, {
      responseType: 'blob'
    });
  }
  private apiUrl = 'http://localhost:8000/api/visits';

  constructor(private http: HttpClient) { }

  getVisits(employeeId?: number): Observable<any[]> {
    let url = this.apiUrl;
    if (employeeId) {
      url += `?employee_id=${employeeId}`;
    }
    return this.http.get<any[]>(url);
  }

  getVisit(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createVisit(visit: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, visit);
  }

  updateVisit(id: number, visit: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, visit);
  }

  deleteVisit(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
