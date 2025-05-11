import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Client {
  id: number;
  name: string;
  description?: string;
  logo_path?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active?: boolean;
  is_favorite?: boolean;
  indicators?: {
    mouvements?: number;
    joursRetards?: number;
    etablissementsInconnus?: number;
    programmees?: number;
    suspendues?: number;
    sensibles?: number;
    sansAS?: number;
    importsEnAttente?: number;
    facturesEnAttente?: number;
    facturesRapprochement?: number;
    rejetImport?: number;
    [key: string]: number | undefined;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8000/api/clients';
  private clientsSubject = new BehaviorSubject<Client[]>([]);

  // HTTP options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // Initial load of clients
    this.loadClients();
  }

  // Load all clients from the backend
  private loadClients(): void {
    this.http.get<any>(this.apiUrl)
      .pipe(
        map(response => {
          // If the API returns a data property, extract it
          const clients = response.data ? response.data : response;
          return clients as Client[];
        }),
        catchError(this.handleError<Client[]>('loadClients', []))
      )
      .subscribe(clients => {
        this.clientsSubject.next(clients);
      });
  }

  // Get all clients as an observable
  getClients(): Observable<Client[]> {
    return this.clientsSubject.asObservable();
  }

  // Get a specific client by ID
  getClientById(id: number): Observable<Client> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const client = response.data ? response.data : response;
        return client as Client;
      }),
      catchError(this.handleError<Client>(`getClient id=${id}`))
    );
  }

  // Add a new client
  addClient(client: Omit<Client, 'id'>): Observable<Client> {
    return this.http.post<any>(this.apiUrl, client, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const newClient = response.data ? response.data : response;

        // Update the local data
        const currentClients = this.clientsSubject.getValue();
        this.clientsSubject.next([...currentClients, newClient]);

        return newClient as Client;
      }),
      catchError(this.handleError<Client>('addClient'))
    );
  }

  // Update a client
  updateClient(client: Client): Observable<Client> {
    const url = `${this.apiUrl}/${client.id}`;
    return this.http.put<any>(url, client, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const updatedClient = response.data ? response.data : response;

        // Update the local data
        const clients = this.clientsSubject.getValue();
        const index = clients.findIndex(c => c.id === client.id);
        if (index !== -1) {
          clients[index] = updatedClient;
          this.clientsSubject.next([...clients]);
        }

        return updatedClient as Client;
      }),
      catchError(this.handleError<Client>(`updateClient id=${client.id}`))
    );
  }

  // Delete a client
  deleteClient(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap(_ => {
        // Update the local data
        const clients = this.clientsSubject.getValue();
        this.clientsSubject.next(clients.filter(c => c.id !== id));
      }),
      catchError(this.handleError<void>(`deleteClient id=${id}`))
    );
  }

  // Toggle client favorite status
  toggleFavorite(id: number): Observable<Client> {
    const url = `${this.apiUrl}/${id}/toggle-favorite`;
    return this.http.post<any>(url, {}, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const updatedClient = response.data ? response.data : response;

        // Update the local data
        const clients = this.clientsSubject.getValue();
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
          clients[index] = updatedClient;
          this.clientsSubject.next([...clients]);
        }

        return updatedClient as Client;
      }),
      catchError(this.handleError<Client>(`toggleFavorite id=${id}`))
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
