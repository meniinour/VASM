import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ContactRequest {
  employee_id?: number;
  client_id?: number;
  subject: string;
  message: string;
}

export interface IncidentRequest {
  client_id: number;
  type: string;
  severity: string;
  date: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private apiUrl = 'http://localhost:8000/api';

  // HTTP options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Contact employee's manager
  contactManager(request: ContactRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/contact/manager`, request, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        return response.data ? response.data : response;
      }),
      catchError(this.handleError<any>('contactManager'))
    );
  }

  // Contact SPST assistant
  contactAssistant(request: ContactRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/contact/assistant`, request, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        return response.data ? response.data : response;
      }),
      catchError(this.handleError<any>('contactAssistant'))
    );
  }

  // Contact client RRH (HR)
  contactRRH(request: ContactRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/contact/rrh`, request, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        return response.data ? response.data : response;
      }),
      catchError(this.handleError<any>('contactRRH'))
    );
  }

  // Declare an incident
  declareIncident(incident: IncidentRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/incidents/declare`, incident, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        return response.data ? response.data : response;
      }),
      catchError(this.handleError<any>('declareIncident'))
    );
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
