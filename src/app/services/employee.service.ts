
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8000/api/employees';

  constructor(private http: HttpClient) { }

  getEmployees(clientId?: number): Observable<any[]> {
    let url = this.apiUrl;
    if (clientId) {
      url += `?client_id=${clientId}`;
    }
    return this.http.get<any[]>(url);
  }

  getEmployeesByClient(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?client_id=${clientId}`);
  }

  getEmployee(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
