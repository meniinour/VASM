import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Appointment {
  id: number;
  employee_id: number;
  date: string;
  envoi?: string;
  ar?: boolean;
  ordonnance?: boolean;
  accepte?: boolean;
  excusable?: boolean;
  reporte?: boolean;
  honore?: boolean;
  motif?: string;
  commentaire?: string;
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
export class AppointmentService {
  private apiUrl = 'http://localhost:8000/api/appointments';
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  // HTTP options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // Initial load of appointments
    this.loadAppointments();
  }

  // Load all appointments from the backend
  private loadAppointments(filters?: any): void {
    let params = new HttpParams();

    // Add filters if provided
    if (filters) {
      if (filters.employee_id) params = params.append('employee_id', filters.employee_id);
      if (filters.date_from) params = params.append('date_from', filters.date_from);
      if (filters.date_to) params = params.append('date_to', filters.date_to);
      if (filters.honore !== undefined) params = params.append('honore', filters.honore.toString());
    }

    this.http.get<any>(this.apiUrl, { params })
      .pipe(
        map(response => {
          // If the API returns a data property, extract it
          const appointments = response.data ? response.data : response;
          return appointments as Appointment[];
        }),
        catchError(this.handleError<Appointment[]>('loadAppointments', []))
      )
      .subscribe(appointments => {
        this.appointmentsSubject.next(appointments);
      });
  }

  // Get all appointments as an observable
  getAppointments(filters?: any): Observable<Appointment[]> {
    if (filters) {
      this.loadAppointments(filters);
    }
    return this.appointmentsSubject.asObservable();
  }

  // Get a specific appointment by ID
  getAppointmentById(id: number): Observable<Appointment> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const appointment = response.data ? response.data : response;
        return appointment as Appointment;
      }),
      catchError(this.handleError<Appointment>(`getAppointment id=${id}`))
    );
  }

  // Create a new appointment
  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http.post<any>(this.apiUrl, appointment, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const newAppointment = response.data ? response.data : response;

        // Update the local data
        const currentAppointments = this.appointmentsSubject.getValue();
        this.appointmentsSubject.next([...currentAppointments, newAppointment]);

        return newAppointment as Appointment;
      }),
      catchError(this.handleError<Appointment>('createAppointment'))
    );
  }

  // Update an appointment
  updateAppointment(id: number, appointment: Partial<Appointment>): Observable<Appointment> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, appointment, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const updatedAppointment = response.data ? response.data : response;

        // Update the local data
        const appointments = this.appointmentsSubject.getValue();
        const index = appointments.findIndex(a => a.id === id);
        if (index !== -1) {
          appointments[index] = updatedAppointment;
          this.appointmentsSubject.next([...appointments]);
        }

        return updatedAppointment as Appointment;
      }),
      catchError(this.handleError<Appointment>(`updateAppointment id=${id}`))
    );
  }

  // Delete an appointment
  deleteAppointment(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap(_ => {
        // Update the local data
        const appointments = this.appointmentsSubject.getValue();
        this.appointmentsSubject.next(appointments.filter(a => a.id !== id));
      }),
      catchError(this.handleError<void>(`deleteAppointment id=${id}`))
    );
  }

  // Export appointments
  exportAppointments(format: string, filters?: any): Observable<Blob> {
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
      catchError(this.handleError<Blob>(`exportAppointments format=${format}`))
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
