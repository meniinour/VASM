import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Medecin {
  id: number;
  nom: string;
  specialite: string;
  numeroPro: string;
  telephone: string;
  email: string;
  adresse: string;
  disponibilite?: string[];
}

export interface RendezVous {
  id: number;
  medecinId: number;
  salarieId: number;
  date: string;
  heure: string;
  motif: string;
  statut: 'planifié' | 'annulé' | 'terminé';
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  // Données temporaires pour la simulation
  private medecins: Medecin[] = [
    {
      id: 1,
      nom: 'Dr. Martin Dupont',
      specialite: 'Médecine générale',
      numeroPro: 'MG12345',
      telephone: '01 23 45 67 89',
      email: 'martin.dupont@medical.fr',
      adresse: '15 rue de la Santé, 75014 Paris',
      disponibilite: ['Lundi: 9h-17h', 'Mercredi: 9h-17h', 'Vendredi: 9h-12h']
    },
    {
      id: 2,
      nom: 'Dr. Sophie Laurent',
      specialite: 'Cardiologie',
      numeroPro: 'CA54321',
      telephone: '01 98 76 54 32',
      email: 'sophie.laurent@cardio.fr',
      adresse: '8 avenue Pasteur, 75015 Paris',
      disponibilite: ['Mardi: 8h-16h', 'Jeudi: 8h-16h', 'Vendredi: 14h-18h']
    },
    {
      id: 3,
      nom: 'Dr. Philippe Mercier',
      specialite: 'Dermatologie',
      numeroPro: 'DE78901',
      telephone: '01 45 67 89 01',
      email: 'philippe.mercier@derma.fr',
      adresse: '22 rue des Écoles, 75005 Paris',
      disponibilite: ['Lundi: 13h-19h', 'Mercredi: 13h-19h', 'Jeudi: 9h-15h']
    },
    {
      id: 4,
      nom: 'Dr. Camille Petit',
      specialite: 'Psychiatrie',
      numeroPro: 'PS45678',
      telephone: '01 23 78 90 12',
      email: 'camille.petit@psy.fr',
      adresse: '5 boulevard Saint-Michel, 75006 Paris',
      disponibilite: ['Mardi: 10h-18h', 'Jeudi: 10h-18h', 'Vendredi: 10h-16h']
    },
    {
      id: 5,
      nom: 'Dr. Thomas Lemoine',
      specialite: 'Ophtalmologie',
      numeroPro: 'OP98765',
      telephone: '01 90 87 65 43',
      email: 'thomas.lemoine@ophtalmo.fr',
      adresse: '17 rue de Rennes, 75006 Paris',
      disponibilite: ['Lundi: 8h-16h', 'Mardi: 8h-16h', 'Mercredi: 8h-12h']
    }
  ];

  private rendezVous: RendezVous[] = [
    {
      id: 1,
      medecinId: 1,
      salarieId: 2,
      date: '2025-05-25',
      heure: '10:30',
      motif: 'Visite médicale annuelle',
      statut: 'planifié'
    },
    {
      id: 2,
      medecinId: 3,
      salarieId: 1,
      date: '2025-05-22',
      heure: '14:00',
      motif: 'Problème de peau',
      statut: 'planifié'
    }
  ];

  constructor(private http: HttpClient) { }

  // Méthodes pour les médecins
  getMedecins(): Observable<Medecin[]> {
    // Simulation d'une requête HTTP
    return of(this.medecins).pipe(
      catchError(this.handleError<Medecin[]>('getMedecins', []))
    );
  }

  getMedecinById(id: number): Observable<Medecin | null> {
    const medecin = this.medecins.find(m => m.id === id);
    return of(medecin || null).pipe(
      catchError(this.handleError<Medecin | null>('getMedecinById', null))
    );
  }

  addMedecin(medecin: Omit<Medecin, 'id'>): Observable<Medecin> {
    const newMedecin = {
      ...medecin,
      id: Math.max(...this.medecins.map(m => m.id), 0) + 1
    };
    this.medecins.push(newMedecin as Medecin);
    return of(newMedecin as Medecin).pipe(
      catchError(this.handleError<Medecin>('addMedecin'))
    );
  }

  updateMedecin(medecin: Medecin): Observable<Medecin> {
    const index = this.medecins.findIndex(m => m.id === medecin.id);
    if (index !== -1) {
      this.medecins[index] = medecin;
    }
    return of(medecin).pipe(
      catchError(this.handleError<Medecin>('updateMedecin'))
    );
  }

  deleteMedecin(id: number): Observable<boolean> {
    const initialLength = this.medecins.length;
    this.medecins = this.medecins.filter(m => m.id !== id);
    return of(initialLength !== this.medecins.length).pipe(
      catchError(this.handleError<boolean>('deleteMedecin', false))
    );
  }

  // Méthodes pour les rendez-vous
  getRendezVous(): Observable<RendezVous[]> {
    return of(this.rendezVous).pipe(
      catchError(this.handleError<RendezVous[]>('getRendezVous', []))
    );
  }

  getRendezVousById(id: number): Observable<RendezVous | null> {
    const rdv = this.rendezVous.find(r => r.id === id);
    return of(rdv || null).pipe(
      catchError(this.handleError<RendezVous | null>('getRendezVousById', null))
    );
  }

  getRendezVousBySalarieId(salarieId: number): Observable<RendezVous[]> {
    const rdvs = this.rendezVous.filter(r => r.salarieId === salarieId);
    return of(rdvs).pipe(
      catchError(this.handleError<RendezVous[]>('getRendezVousBySalarieId', []))
    );
  }

  getRendezVousByMedecinId(medecinId: number): Observable<RendezVous[]> {
    const rdvs = this.rendezVous.filter(r => r.medecinId === medecinId);
    return of(rdvs).pipe(
      catchError(this.handleError<RendezVous[]>('getRendezVousByMedecinId', []))
    );
  }

  addRendezVous(rdv: Omit<RendezVous, 'id'>): Observable<RendezVous> {
    const newRdv = {
      ...rdv,
      id: Math.max(...this.rendezVous.map(r => r.id), 0) + 1
    };
    this.rendezVous.push(newRdv as RendezVous);
    return of(newRdv as RendezVous).pipe(
      catchError(this.handleError<RendezVous>('addRendezVous'))
    );
  }

  updateRendezVous(rdv: RendezVous): Observable<RendezVous> {
    const index = this.rendezVous.findIndex(r => r.id === rdv.id);
    if (index !== -1) {
      this.rendezVous[index] = rdv;
    }
    return of(rdv).pipe(
      catchError(this.handleError<RendezVous>('updateRendezVous'))
    );
  }

  deleteRendezVous(id: number): Observable<boolean> {
    const initialLength = this.rendezVous.length;
    this.rendezVous = this.rendezVous.filter(r => r.id !== id);
    return of(initialLength !== this.rendezVous.length).pipe(
      catchError(this.handleError<boolean>('deleteRendezVous', false))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Renvoie un résultat vide pour continuer l'application
      return of(result as T);
    };
  }
}
