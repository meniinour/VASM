
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  contactManager(employeeId: number, subject: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact/manager`, {
      employee_id: employeeId,
      subject,
      message
    });
  }

  contactAssistant(employeeId: number, subject: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact/assistant`, {
      employee_id: employeeId,
      subject,
      message
    });
  }

  contactRRH(clientId: number, subject: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact/rrh`, {
      client_id: clientId,
      subject,
      message
    });
  }

  declareIncident(clientId: number, incidentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incidents/declare`, {
      client_id: clientId,
      ...incidentData
    });
  }
}
