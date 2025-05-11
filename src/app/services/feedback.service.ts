import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  // Définition directe du chemin de l'API sans passer par environment
  private apiUrl = 'http://localhost:8000/api/feedback';

  constructor(private http: HttpClient) { }

  /**
   * Envoie un nouveau feedback au serveur
   */
  submitFeedback(feedbackData: any): Observable<any> {
    // Transformer les données pour correspondre au format attendu par l'API
    const apiData = {
      rating: feedbackData.rating,
      emotion: feedbackData.emotion,
      text: feedbackData.text,
      categories: feedbackData.categories,
      is_anonymous: feedbackData.anonymous,
      name: feedbackData.name,
      email: feedbackData.email,
      want_response: feedbackData.wantResponse
    };

    return this.http.post(this.apiUrl, apiData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;

      // Si nous avons des erreurs de validation (422)
      if (error.status === 422 && error.error && error.error.errors) {
        const validationErrors = error.error.errors;
        console.error('Erreurs de validation:', validationErrors);
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
