import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, Employee } from '../models/client.model';
@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getClientById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/clients/${id}`);
  }

  sendEmail(employeeId: number, recipientType: string) {
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/email`, { recipientType });
  }

  reportIncident(employeeId: number, incidentDetails: string) {
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/incident`, { incidentDetails });
  }

  createVisit(employeeId: number, visitDetails: any) {
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/visits`, visitDetails);
  }
}