// src/app/services/spst.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpstService {
  private apiUrl = 'http://localhost:8000/api/spsts';

  constructor(private http: HttpClient) { }

  /**
   * Get all SPST centers
   */
  getAllSPSTs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Get a specific SPST center by ID
   * @param id SPST center ID
   */
  getSpstById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new SPST center
   * @param spst SPST center data
   */
  createSpst(spst: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, spst);
  }

  /**
   * Update an existing SPST center
   * @param id SPST center ID
   * @param spst Updated SPST center data
   */
  updateSpst(id: number, spst: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, spst);
  }

  /**
   * Delete a SPST center
   * @param id SPST center ID
   */
  deleteSpst(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get notifications for the current user
   */
  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications`);
  }

  /**
   * Mark a notification as read
   * @param notificationId Notification ID
   */
  markNotificationAsRead(notificationId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/notifications/${notificationId}/read`, {});
  }

  /**
   * Get available services from the SPST
   */
  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/services`);
  }

  /**
   * Request a service from the SPST
   * @param serviceId Service ID
   * @param requestData Additional request data
   */
  requestService(serviceId: number, requestData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/services/${serviceId}/request`, requestData);
  }

  /**
   * Get visits for an employee
   * @param employeeId Employee ID
   */
  getVisits(employeeId?: number): Observable<any[]> {
    let url = `${this.apiUrl}/visits`;
    if (employeeId) {
      url += `?employee_id=${employeeId}`;
    }
    return this.http.get<any[]>(url);
  }

  /**
   * Get documents available to the current user
   */
  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents`);
  }

  /**
   * Download a specific document
   * @param documentId Document ID
   */
  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${documentId}/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Schedule a visit for an employee
   * @param employeeId Employee ID
   * @param visitData Visit scheduling data
   */
  scheduleVisit(employeeId: number, visitData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/visits/schedule`, {
      employee_id: employeeId,
      ...visitData
    });
  }

  /**
   * Reschedule an existing visit
   * @param visitId Visit ID
   * @param visitData New visit scheduling data
   */
  rescheduleVisit(visitId: number, visitData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/visits/${visitId}/reschedule`, visitData);
  }

  /**
   * Cancel a scheduled visit
   * @param visitId Visit ID
   * @param reason Cancellation reason
   */
  cancelVisit(visitId: number, reason: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/visits/${visitId}/cancel`, { reason });
  }

  /**
   * Get contacts for a specific SPST center
   * @param spstId SPST center ID
   */
  getContacts(spstId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${spstId}/contacts`);
  }
}
