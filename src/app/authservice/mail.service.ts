import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Mail {
  id: number;
  date: string;
  client: string;
  nom: string;
  sujet: string;
  traitement: string;
  dateTraitement: string;
  commentaire: string;
  email: string;
  status: 'libre' | 'affecte' | 'bloque';
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private api = 'http://localhost:8000/api';
  private mails: Mail[] = [
    {
      id: 1,
      date: '2024-04-09T10:30:00',
      client: 'BPALC',
      nom: 'Jean Dupont',
      sujet: 'Demande de crédit',
      traitement: 'En attente',
      dateTraitement: '2024-04-09T11:00:00',
      commentaire: 'Dossier incomplet',
      email: 'jean.dupont@example.com',
      status: 'libre'
    },
    {
      id: 2,
      date: '2024-04-09T09:15:00',
      client: 'BPALC',
      nom: 'Marie Martin',
      sujet: 'Réclamation carte',
      traitement: 'Traité',
      dateTraitement: '2024-04-09T10:00:00',
      commentaire: 'Carte bloquée',
      email: 'marie.martin@example.com',
      status: 'bloque'
    },
    {
      id: 3,
      date: '2024-04-09T08:45:00',
      client: 'BPALC',
      nom: 'Pierre Durant',
      sujet: 'Changement adresse',
      traitement: 'En cours',
      dateTraitement: '2024-04-09T09:30:00',
      commentaire: 'Justificatif manquant',
      email: 'pierre.durant@example.com',
      status: 'affecte'
    }
  ];

  constructor(private http: HttpClient) {}

  getMails(): Observable<Mail[]> {
    return of(this.mails);
  }

  getAffectationsLegacy(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
  
  affecter(email: string): Observable<ApiResponse> {
    const mailIndex = this.mails.findIndex(m => m.email === email && m.status === 'libre');
    if (mailIndex === -1) {
      return of({ success: false, message: 'Mail non trouvé ou déjà affecté' });
    }
    this.mails[mailIndex].status = 'affecte';
    this.mails[mailIndex].dateTraitement = new Date().toISOString();
    return of({ success: true, message: 'Mail affecté avec succès' });
  }

  getAffectations() {
    return this.http.get(`${this.api}/affectations`);
  }

  bloquer(id: number): Observable<ApiResponse> {
    const mailIndex = this.mails.findIndex(m => m.id === id);
    if (mailIndex === -1) {
      return of({ success: false, message: 'Mail non trouvé' });
    }
    this.mails[mailIndex].status = 'bloque';
    return of({ success: true, message: 'Mail bloqué avec succès' });
  }

  debloquer(id: number): Observable<ApiResponse> {
    const mailIndex = this.mails.findIndex(m => m.id === id && m.status === 'bloque');
    if (mailIndex === -1) {
      return of({ success: false, message: 'Mail non trouvé ou non bloqué' });
    }
    this.mails[mailIndex].status = 'libre';
    return of({ success: true, message: 'Mail débloqué avec succès' });
  }

  liberer(id: number): Observable<ApiResponse> {
    const mailIndex = this.mails.findIndex(m => m.id === id && m.status === 'affecte');
    if (mailIndex === -1) {
      return of({ success: false, message: 'Mail non trouvé ou non affecté' });
    }
    this.mails[mailIndex].status = 'libre';
    return of({ success: true, message: 'Mail libéré avec succès' });
  }
}
