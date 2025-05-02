import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';

export interface Invoice {
  id: number;
  reference: string;
  date: Date;
  amount: number;
  paid: boolean;
  description: string;
  dueDate: Date;
  isOverdue?: boolean;
}

export interface PaymentRequest {
  invoiceIds: number[];
  paymentMethod: string;
  cardDetails?: CardDetails;
  totalAmount: number;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
  paidInvoices: number[];
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // URL de l'API (à remplacer par la vraie URL en production)
  private apiUrl = 'api/invoices';

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste des factures
   */
  getInvoices(): Observable<Invoice[]> {
    // Dans un environnement réel, nous utiliserions :
    // return this.http.get<Invoice[]>(this.apiUrl)
    //   .pipe(
    //     catchError(this.handleError<Invoice[]>('getInvoices', []))
    //   );
    
    // Pour la démo, on simule une réponse API avec des données en dur
    return this.simulateHttpRequest(this.getMockInvoices());
  }

  /**
   * Effectue un paiement
   * @param paymentRequest Détails de la demande de paiement
   */
  processPayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    // Dans un environnement réel :
    // return this.http.post<PaymentResponse>(`${this.apiUrl}/pay`, paymentRequest)
    //   .pipe(
    //     catchError(this.handleError<PaymentResponse>('processPayment'))
    //   );
    
    // Simulation de validation des données
    if (paymentRequest.invoiceIds.length === 0) {
      return throwError(() => new Error('Aucune facture sélectionnée pour le paiement'));
    }
    
    if (paymentRequest.totalAmount <= 0) {
      return throwError(() => new Error('Le montant du paiement doit être supérieur à zéro'));
    }
    
    // Simulation d'une réponse après 1.5 secondes
    const response: PaymentResponse = {
      success: true,
      transactionId: `TX-${new Date().getTime()}`,
      message: 'Paiement traité avec succès',
      paidInvoices: paymentRequest.invoiceIds
    };
    
    return this.simulateHttpRequest(response, 1500);
  }

  /**
   * Met à jour le statut d'une facture
   * @param id ID de la facture
   * @param paid Statut de paiement
   */
  updateInvoiceStatus(id: number, paid: boolean): Observable<Invoice> {
    // Dans un environnement réel :
    // return this.http.patch<Invoice>(`${this.apiUrl}/${id}`, { paid })
    //   .pipe(
    //     catchError(this.handleError<Invoice>('updateInvoiceStatus'))
    //   );
    
    // Simulation d'une réponse
    const invoice = this.getMockInvoices().find(inv => inv.id === id);
    
    if (!invoice) {
      return throwError(() => new Error(`Facture avec ID ${id} non trouvée`));
    }
    
    invoice.paid = paid;
    return this.simulateHttpRequest(invoice);
  }

  /**
   * Gestion des erreurs HTTP
   * @param operation Nom de l'opération qui a échoué
   * @param result Valeur optionnelle à retourner comme observable de résultat
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // On peut envoyer l'erreur à un service de journalisation
      // this.logService.logError(error);
      
      // On retourne un résultat par défaut ou vide pour continuer l'exécution
      return of(result as T);
    };
  }

  /**
   * Simule une requête HTTP avec un délai
   * @param data Données à retourner
   * @param delayMs Délai en millisecondes
   */
  private simulateHttpRequest<T>(data: T, delayMs: number = 500): Observable<T> {
    return of(data).pipe(
      delay(delayMs),
      tap(_ => console.log('API Request Simulated'))
    );
  }

  /**
   * Génère des factures de test
   */
  private getMockInvoices(): Invoice[] {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    const invoices: Invoice[] = [
      {
        id: 1,
        reference: 'FAC-2025-0001',
        date: new Date(today.getTime() - 30 * oneDay),
        amount: 156.42,
        paid: false,
        description: 'Abonnement mensuel - Janvier 2025',
        dueDate: new Date(today.getTime() - 5 * oneDay),
        isOverdue: true
      },
      {
        id: 2,
        reference: 'FAC-2025-0002',
        date: new Date(today.getTime() - 25 * oneDay),
        amount: 89.90,
        paid: true,
        description: 'Services additionnels - Janvier 2025',
        dueDate: new Date(today.getTime() - 10 * oneDay),
        isOverdue: false
      },
      {
        id: 3,
        reference: 'FAC-2025-0003',
        date: new Date(today.getTime() - 15 * oneDay),
        amount: 156.42,
        paid: false,
        description: 'Abonnement mensuel - Février 2025',
        dueDate: new Date(today.getTime() + 15 * oneDay),
        isOverdue: false
      },
      {
        id: 4,
        reference: 'FAC-2025-0004',
        date: new Date(today.getTime() - 10 * oneDay),
        amount: 45.50,
        paid: false,
        description: 'Services additionnels - Février 2025',
        dueDate: new Date(today.getTime() + 20 * oneDay),
        isOverdue: false
      },
      {
        id: 5,
        reference: 'FAC-2025-0005',
        date: new Date(today.getTime() - 5 * oneDay),
        amount: 120.00,
        paid: false,
        description: 'Prestation spéciale',
        dueDate: new Date(today.getTime() + 25 * oneDay),
        isOverdue: false
      }
    ];
    
    return invoices;
  }
}