import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface StatsPeriod {
  type: 'month' | 'quarter' | 'year';
  start: string;
  end: string;
  label?: string;
}

export interface VisitStatistics {
  period: {
    type: string;
    start: string;
    end: string;
    label: string;
  };
  total_visits: number;
  completed_visits: number;
  completion_rate: number;
  by_type: Array<{
    type: string;
    total: number;
    completed: number;
    scheduled: number;
    cancelled: number;
  }>;
}

export interface AppointmentStatistics {
  period: {
    type: string;
    start: string;
    end: string;
    label: string;
  };
  total_appointments: number;
  honored_appointments: number;
  cancelled_appointments: number;
  no_response_appointments: number;
  completion_rate: number;
}

export interface DashboardStatistics {
  period: {
    type: string;
    start: string;
    end: string;
    label: string;
  };
  total_clients: number;
  total_employees: number;
  total_visits: number;
  completed_visits: number;
  completion_rate: number;
  top_clients: Array<{
    id: number;
    name: string;
    visits_count: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8000/api/statistics';

  // HTTP options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Get visit statistics
  getVisitStats(period: StatsPeriod, filters?: any): Observable<any> {
    const url = `${this.apiUrl}/visits`;

    const data = {
      period: period,
      filters: filters || {}
    };

    return this.http.post<any>(url, data, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const statistics = response.data ? response.data : response;
        return statistics;
      }),
      catchError(this.handleError<any>('getVisitStats', {} as any))
    );
  }

  // Get appointment statistics
  getAppointmentStatistics(period: StatsPeriod, filters?: any): Observable<AppointmentStatistics> {
    const url = `${this.apiUrl}/appointments`;

    const data = {
      period: period,
      filters: filters || {}
    };

    return this.http.post<any>(url, data, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const statistics = response.data ? response.data : response;
        return statistics as AppointmentStatistics;
      }),
      catchError(this.handleError<AppointmentStatistics>('getAppointmentStatistics', {} as AppointmentStatistics))
    );
  }

  // Get dashboard statistics
  getDashboardSummary(period: StatsPeriod, filters?: any): Observable<any> {
    const url = `${this.apiUrl}/dashboard`;

    const data = {
      period: period,
      filters: filters || {}
    };

    return this.http.post<any>(url, data, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const statistics = response.data ? response.data : response;
        return statistics;
      }),
      catchError(this.handleError<any>('getDashboardSummary', {} as any))
    );
  }

  // Export statistics report
  exportStatisticsReport(format: string, period: StatsPeriod, filters?: any): Observable<Blob> {
    const url = `${this.apiUrl}/export/${format}`;

    const data = {
      period: period,
      filters: filters || {}
    };

    return this.http.post(url, data, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError<Blob>('exportStatisticsReport'))
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
