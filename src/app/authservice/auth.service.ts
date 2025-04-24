import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://127.0.0.1:8000/api';
  private readonly tokenKey = 'auth_token';
  private readonly tokenExpiryKey = 'token_expiry';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuthStatus());
  authStatus: any;
  

  constructor(
    private http: HttpClient,
    private router: Router,
    private msalService: MsalService
  ) {}
  
  // Étape 1 : Récupérer le cookie CSRF de Laravel
  initCsrf() {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, { withCredentials: true });
  }

  

  // Exemple pour récupérer l'utilisateur connecté
  getUser() {
    return this.http.get(`${this.apiUrl}/api/user`, { withCredentials: true });
  }


  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private checkInitialAuthStatus(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    if (!token || !expiry) return false;
    return new Date() < new Date(expiry);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.storeAuthData(response);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  loginWithMicrosoft(): Observable<any> {
    return from(this.msalService.loginPopup({ scopes: ['user.read'] })).pipe(
      switchMap(() => this.msalService.acquireTokenSilent({ scopes: ['user.read'] })),
      tap((response: any) => {
        localStorage.setItem('msal_token', response.accessToken);
        this.authStatus.next(true);
        this.router.navigate(['/home']);
      }),
      catchError(this.handleError)
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(data: { token: string, password: string, password_confirmation: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data).pipe(
      catchError(this.handleError)
    );
  }

  logout()  {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
    this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe({
      complete: () => this.clearAuthData(),
      error: () => this.clearAuthData()
    });
    return this.http.post(`${this.apiUrl}/api/logout`, {}, { withCredentials: true });
  
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private storeAuthData(response: any): void {
    if (response.token) {
      localStorage.setItem(this.tokenKey, response.token);
      const expiryDate = new Date();
      expiryDate.setSeconds(expiryDate.getSeconds() + (response.expires_in || 3600));
      localStorage.setItem(this.tokenExpiryKey, expiryDate.toISOString());
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiryKey);
    localStorage.removeItem('msal_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  private handleError(error: any): Observable<never> {
    console.error('Erreur auth:', error);
    return throwError(() => new Error(error.error?.message || error.message || 'Une erreur est survenue'));
  }
}
