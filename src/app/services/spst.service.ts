import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface SPST {
  id: number;
  name: string;
  address?: string;
  postal_code?: string;
  city?: string;
  phone?: string;
  url?: string;
  message?: string;
}

export interface SPSTNotification {
  id: number;
  message: string;
  date: Date;
  icon: string;
  read: boolean;
}

export interface SPSTService {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface SPSTVisit {
  id: number;
  type: string;
  date: Date;
  doctor: string;
  location: string;
  status: 'upcoming' | 'completed';
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpstService {
  private apiUrl = 'http://localhost:8000/api/spsts';

  // HTTP options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Get all SPST centers
  getAllSPSTs(): Observable<SPST[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const spsts = response.data ? response.data : response;
        return spsts as SPST[];
      }),
      catchError(this.handleError<SPST[]>('getAllSPSTs', []))
    );
  }

  // Get SPST center by ID
  getSpstById(id: number): Observable<SPST> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const spst = response.data ? response.data : response;
        return spst as SPST;
      }),
      catchError(this.handleError<SPST>(`getSpst id=${id}`))
    );
  }

  // Get SPST notifications
  getNotifications(): Observable<SPSTNotification[]> {
    const url = `${this.apiUrl}/notifications`;
    return this.http.get<any>(url).pipe(
      map(response => {
        // If the API returns a data, extract it
        const notifications = response.data ? response.data : response;
        return notifications as SPSTNotification[];
      }),
      catchError(this.handleError<SPSTNotification[]>('getNotifications', []))
    );
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: number): Observable<any> {
    const url = `${this.apiUrl}/notifications/${notificationId}/read`;
    return this.http.put<any>(url, {}, this.httpOptions).pipe(
      catchError(this.handleError<any>(`markNotificationAsRead id=${notificationId}`))
    );
  }

  // Get available services
  getServices(): Observable<SPSTService[]> {
    const url = `${this.apiUrl}/services`;
    return this.http.get<any>(url).pipe(
      map(response => {
        // If the API returns a data, extract it
        const services = response.data ? response.data : response;
        return services as SPSTService[];
      }),
      catchError(this.handleError<SPSTService[]>('getServices', []))
    );
  }

  // Request a service
  requestService(serviceId: number, details?: any): Observable<any> {
    const url = `${this.apiUrl}/services/${serviceId}/request`;
    return this.http.post<any>(url, details || {}, this.httpOptions).pipe(
      catchError(this.handleError<any>(`requestService id=${serviceId}`))
    );
  }

  // Get visits (medical appointments)
  getVisits(employeeId?: number): Observable<SPSTVisit[]> {
    let url = `${this.apiUrl}/visits`;
    if (employeeId) {
      url += `?employee_id=${employeeId}`;
    }

    return this.http.get<any>(url).pipe(
      map(response => {
        // If the API returns a data, extract it
        const visits = response.data ? response.data : response;
        return visits as SPSTVisit[];
      }),
      catchError(this.handleError<SPSTVisit[]>('getVisits', []))
    );
  }

  // Get documents
  getDocuments(): Observable<any[]> {
    const url = `${this.apiUrl}/documents`;
    return this.http.get<any>(url).pipe(
      map(response => {
        // If the API returns a data, extract it
        const documents = response.data ? response.data : response;
        return documents as any[];
      }),
      catchError(this.handleError<any[]>('getDocuments', []))
    );
  }

  // Download document
  downloadDocument(documentId: number): Observable<Blob> {
    const url = `${this.apiUrl}/documents/${documentId}/download`;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError<Blob>('downloadDocument'))
    );
  }

  // Create a new SPST center
  createSpst(spst: Omit<SPST, 'id'>): Observable<SPST> {
    return this.http.post<any>(this.apiUrl, spst, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data, extract it
        const newSpst = response.data ? response.data : response;
        return newSpst as SPST;
      }),
      catchError(this.handleError<SPST>('createSpst'))
    );
  }

  // Update a SPST center
  updateSpst(spst: SPST): Observable<SPST> {
    const url = `${this.apiUrl}/${spst.id}`;
    return this.http.put<any>(url, spst, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data, extract it
        const updatedSpst = response.data ? response.data : response;
        return updatedSpst as SPST;
      }),
      catchError(this.handleError<SPST>(`updateSpst id=${spst.id}`))
    );
  }

  // Delete a SPST center
  deleteSpst(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      catchError(this.handleError<void>(`deleteSpst id=${id}`))
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
