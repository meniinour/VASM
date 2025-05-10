import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  exportAppointments(format: string, options: { employee_ids: any }): Observable<Blob> {
    const url = `${this.apiUrl}/export/${format}`;
    return this.http.post(url, options, {
      responseType: 'blob'
    });
  }
  private apiUrl = 'http://localhost:8000/api/appointments';

  constructor(private http: HttpClient) { }

  getAppointments(employeeId?: number): Observable<any[]> {
    let url = this.apiUrl;
    if (employeeId) {
      url += `?employee_id=${employeeId}`;
    }
    return this.http.get<any[]>(url);
  }

  getAppointment(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, appointment);
  }

  updateAppointment(id: number, appointment: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}
