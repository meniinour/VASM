import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Visit {
  id: number;
  employee_id: number;
  type: string;
  etat: string;
  envisagee: string;
  effectuee?: string;
  suivi?: string;
  apte?: boolean;
  observations?: string;
  employee?: {
    id: number;
    name: string;
    [key: string]: any;
  };
  [key: string]: any; // Pour permettre l'accès dynamique aux propriétés
}

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private apiUrl = 'http://localhost:8000/api/visits';
  private visitsSubject = new BehaviorSubject<Visit[]>([]);

  // HTTP options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // Initial load of visits
    this.loadVisits();
  }

  // Load all visits from the backend
  private loadVisits(filters?: any): void {
    let params = new HttpParams();

    // Add filters if provided
    if (filters) {
      if (filters.employee_id) params = params.append('employee_id', filters.employee_id);
      if (filters.client_id) params = params.append('client_id', filters.client_id);
      if (filters.type) params = params.append('type', filters.type);
      if (filters.etat) params = params.append('etat', filters.etat);
      if (filters.date_from) params = params.append('date_from', filters.date_from);
      if (filters.date_to) params = params.append('date_to', filters.date_to);
    }

    this.http.get<any>(this.apiUrl, { params })
      .pipe(
        map(response => {
          // If the API returns a data property, extract it
          const visits = response.data ? response.data : response;
          return visits as Visit[];
        }),
        catchError(this.handleError<Visit[]>('loadVisits', []))
      )
      .subscribe(visits => {
        this.visitsSubject.next(visits);
      });
  }

  // Get all visits as an observable
  getVisits(filters?: any): Observable<Visit[]> {
    if (filters) {
      this.loadVisits(filters);
    }
    return this.visitsSubject.asObservable();
  }

  // Get a specific visit by ID
  getVisitById(id: number): Observable<Visit> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const visit = response.data ? response.data : response;
        return visit as Visit;
      }),
      catchError(this.handleError<Visit>(`getVisit id=${id}`))
    );
  }

  // Create a new visit
  createVisit(visit: Omit<Visit, 'id'>): Observable<Visit> {
    return this.http.post<any>(this.apiUrl, visit, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const newVisit = response.data ? response.data : response;

        // Update the local data
        const currentVisits = this.visitsSubject.getValue();
        this.visitsSubject.next([...currentVisits, newVisit]);

        return newVisit as Visit;
      }),
      catchError(this.handleError<Visit>('createVisit'))
    );
  }

  // Update a visit
  updateVisit(id: number, visit: Partial<Visit>): Observable<Visit> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, visit, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const updatedVisit = response.data ? response.data : response;

        // Update the local data
        const visits = this.visitsSubject.getValue();
        const index = visits.findIndex(v => v.id === id);
        if (index !== -1) {
          visits[index] = updatedVisit;
          this.visitsSubject.next([...visits]);
        }

        return updatedVisit as Visit;
      }),
      catchError(this.handleError<Visit>(`updateVisit id=${id}`))
    );
  }

  // Delete a visit
  deleteVisit(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap(_ => {
        // Update the local data
        const visits = this.visitsSubject.getValue();
        this.visitsSubject.next(visits.filter(v => v.id !== id));
      }),
      catchError(this.handleError<void>(`deleteVisit id=${id}`))
    );
  }

  // Export visits
  exportVisits(format: string, filters?: any): Observable<Blob> {
    const url = `${this.apiUrl}/export/${format}`;

    // Add filters if provided
    const params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
    }

    return this.http.post(url, { params }, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/octet-stream'
      })
    }).pipe(
      catchError(this.handleError<Blob>(`exportVisits format=${format}`))
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
