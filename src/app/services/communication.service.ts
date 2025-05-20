import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
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
    // Check if employee_id is provided
    if (!request.employee_id) {
      return throwError(() => new Error('Employee ID is required'));
    }

    return this.http.post<any>(`${this.apiUrl}/contact/manager`, request, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        return response.data ? response.data : response;
      }),
      catchError(this.handleHttpError('contactManager'))
    );
  }

  // Contact SPST assistant
  contactAssistant(request: ContactRequest): Observable<any> {
    // Check if employee_id is provided
    if (!request.employee_id) {
      return throwError(() => new Error('Employee ID is required'));
    }

    return this.http.post<any>(`${this.apiUrl}/contact/assistant`, request, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        return response.data ? response.data : response;
      }),
      catchError(this.handleHttpError('contactAssistant'))
    );
  }

  // Contact client RRH (HR)
  contactRRH(request: ContactRequest): Observable<any> {
    // Check if client_id is provided
    if (!request.client_id) {
      return throwError(() => new Error('Client ID is required'));
    }

    return this.http.post<any>(`${this.apiUrl}/contact/rrh`, request, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        return response.data ? response.data : response;
      }),
      catchError(this.handleHttpError('contactRRH'))
    );
  }

  // Declare an incident
  declareIncident(incident: IncidentRequest): Observable<any> {
    // Check if client_id is provided
    if (!incident.client_id) {
      return throwError(() => new Error('Client ID is required'));
    }

    // Validate required fields
    if (!incident.type || !incident.severity || !incident.date || !incident.description) {
      return throwError(() => new Error('Type, severity, date, and description are required'));
    }

    return this.http.post<any>(`${this.apiUrl}/incidents/declare`, incident, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        return response.data ? response.data : response;
      }),
      catchError(this.handleHttpError('declareIncident'))
    );
  }

  // Improved error handling with better logging
  private handleHttpError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      // More detailed error logging
      console.error(`${operation} failed:`, error);

      if (error.status === 0) {
        console.error('Connection error. Backend is unreachable.');
      } else if (error.status >= 400 && error.status < 500) {
        console.error(`Client error (${error.status}):`, error.error);
      } else if (error.status >= 500) {
        console.error(`Server error (${error.status}):`, error.error);
      }

      // Convert error to a more user-friendly format
      const userMessage = this.getUserFriendlyErrorMessage(error);

      // Return an error observable with a user-facing error message
      return throwError(() => new Error(userMessage));
    };
  }

  // Convert technical errors to user-friendly messages
  private getUserFriendlyErrorMessage(error: any): string {
    // Default error message
    let message = 'Une erreur est survenue. Veuillez réessayer.';

    if (error.status === 0) {
      message = 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
    } else if (error.status === 400) {
      message = 'Requête invalide. Veuillez vérifier les informations saisies.';
    } else if (error.status === 401) {
      message = 'Vous devez être connecté pour effectuer cette action.';
    } else if (error.status === 403) {
      message = 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.';
    } else if (error.status === 404) {
      message = 'La ressource demandée n\'existe pas.';
    } else if (error.status === 422) {
      message = 'Les données envoyées sont invalides. Veuillez vérifier les informations saisies.';
    } else if (error.status >= 500) {
      message = 'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.';
    }

    // If the server returned a specific message, use it
    if (error.error && error.error.message) {
      message = error.error.message;
    }

    return message;
  }
}
