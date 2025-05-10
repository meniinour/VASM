// src/app/services/statistics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatsPeriod {
  type: 'month' | 'quarter' | 'year';
  start: string;
  end: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8000/api/statistics';

  constructor(private http: HttpClient) { }

  /**
   * Get statistics for visits based on period and filters
   * @param period Time period for the statistics
   * @param filters Additional filters to apply
   */
  getVisitStats(period: StatsPeriod, filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/visits`, { period, filters });
  }

  /**
   * Get statistics for appointments based on period and filters
   * @param period Time period for the statistics
   * @param filters Additional filters to apply
   */
  getAppointmentStats(period: StatsPeriod, filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/appointments`, { period, filters });
  }

  /**
   * Get statistics for clients based on period and filters
   * @param period Time period for the statistics
   * @param filters Additional filters to apply
   */
  getClientStats(period: StatsPeriod, filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clients`, { period, filters });
  }

  /**
   * Get statistics for employees based on period and filters
   * @param period Time period for the statistics
   * @param filters Additional filters to apply
   */
  getEmployeeStats(period: StatsPeriod, filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/employees`, { period, filters });
  }

  /**
   * Get a dashboard summary with all key statistics
   * @param period Time period for the statistics
   * @param filters Additional filters to apply
   */
  getDashboardSummary(period: StatsPeriod, filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/dashboard`, { period, filters });
  }

  /**
   * Export statistics report in specified format
   * @param format Export format (pdf, xlsx, csv)
   * @param period Time period for the statistics
   * @param filters Additional filters to apply
   */
  exportStatisticsReport(format: 'pdf' | 'xlsx' | 'csv', period: StatsPeriod, filters: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export/${format}`, { period, filters }, {
      responseType: 'blob'
    });
  }

  /**
   * Get trend data comparing current period to previous period
   * @param period Current time period
   * @param metric Metric to compare (visits, appointments, etc.)
   * @param filters Additional filters to apply
   */
  getTrendData(period: StatsPeriod, metric: string, filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/trends/${metric}`, { period, filters });
  }

  /**
   * Get top performing clients based on various metrics
   * @param period Time period for the statistics
   * @param limit Number of top clients to return
   * @param metric Metric to sort by (visits, completion, etc.)
   * @param filters Additional filters to apply
   */
  getTopClients(period: StatsPeriod, limit: number, metric: string, filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/top-clients`, { period, limit, metric, filters });
  }

  /**
   * Get statistics for a specific visit type
   * @param visitType Type of visit (VIPP, VIPI, etc.)
   * @param period Time period for the statistics
   * @param filters Additional filters to apply
   */
  getVisitTypeStats(visitType: string, period: StatsPeriod, filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/visit-types/${visitType}`, { period, filters });
  }

  /**
   * Get completion rate statistics
   * @param period Time period for the statistics
   * @param groupBy How to group the results (client, type, etc.)
   * @param filters Additional filters to apply
   */
  getCompletionRateStats(period: StatsPeriod, groupBy: string, filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/completion-rates`, { period, groupBy, filters });
  }

  /**
   * Get historical data for trend analysis
   * @param startPeriod Start period for the historical data
   * @param endPeriod End period for the historical data
   * @param interval Time interval for data points (day, week, month)
   * @param metric Metric to track over time
   * @param filters Additional filters to apply
   */
  getHistoricalData(
    startPeriod: StatsPeriod,
    endPeriod: StatsPeriod,
    interval: string,
    metric: string,
    filters: any
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/historical`, {
      startPeriod,
      endPeriod,
      interval,
      metric,
      filters
    });
  }
}
