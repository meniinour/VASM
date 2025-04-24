import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Utiliser une URL relative pour éviter les problèmes CORS
  private apiUrl = '/backend/api';

  constructor(private http: HttpClient) { 
    console.log('UserService initialisé avec l\'URL API:', this.apiUrl);
  }

  getUsers(): Observable<any[]> {
    console.log('Appel API pour récupérer les utilisateurs');
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      tap(users => console.log('Réponse API utilisateurs:', users)),
      catchError(this.handleError)
    );
  }

  getUser(id: number): Observable<any> {
    console.log('Appel API pour récupérer l\'utilisateur avec ID:', id);
    return this.http.get<any>(`${this.apiUrl}/users/${id}`).pipe(
      tap(user => console.log('Réponse API utilisateur:', user)),
      catchError(this.handleError)
    );
  }

  createUser(user: { email: string, password: string }): Observable<any> {
    console.log('Appel API pour créer un utilisateur:', user);
    return this.http.post<any>(`${this.apiUrl}/users`, user).pipe(
      tap(response => console.log('Réponse API création utilisateur:', response)),
      catchError(this.handleError)
    );
  }

  updateUser(id: number, user: { email: string }): Observable<any> {
    console.log('Appel API pour mettre à jour l\'utilisateur avec ID:', id, user);
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, user).pipe(
      tap(response => console.log('Réponse API mise à jour utilisateur:', response)),
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    console.log('Appel API pour supprimer l\'utilisateur avec ID:', id);
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`).pipe(
      tap(response => console.log('Réponse API suppression utilisateur:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}, message: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage += `, détails: ${error.error.message}`;
      }
    }
    
    console.error('Erreur API:', errorMessage);
    console.error('Détails de l\'erreur:', error);
    
    return throwError(() => new Error(errorMessage));
  }
} 