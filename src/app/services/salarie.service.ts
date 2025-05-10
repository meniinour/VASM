import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Salarie {
  id: number;
  nom: string;
  matricule: string;
  poste: string;
  departement: string;
  dateEmbauche: string;
  clientId?: number; // Ajout de l'ID du client
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class SalarieService {
  private apiUrl = 'http://localhost:8000/api/employees';

  constructor(private http: HttpClient) {}

  // Modification pour accepter un clientId optionnel
  getSalaries(clientId?: number): Observable<Salarie[]> {
    let url = this.apiUrl;
    if (clientId) {
      url += `?client_id=${clientId}`;
      console.log('Making request to:', url); // Debug log
    }

      return this.http.get<any[]>(url).pipe(
      map(employees => {
        console.log('Raw API response:', employees); // Debug log
        return employees.map(emp => ({
          id: emp.id,
          nom: emp.name,
          matricule: emp.matricule || '',
          poste: emp.poste || '',
          departement: emp.departement || '',
          dateEmbauche: emp.startDate || '',
          clientId: emp.client_id
        }));
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des employés:', error);
        return of([]);
      })
    );
  }

  // Les autres méthodes restent largement inchangées
  getSalarieById(id: number): Observable<Salarie | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(emp => ({
        id: emp.id,
        nom: emp.name,
        matricule: emp.matricule || '',
        poste: emp.poste || '',
        departement: emp.departement || '',
        dateEmbauche: emp.startDate || '',
        clientId: emp.client_id
      })),
      catchError(error => {
        console.error(`Erreur lors de la récupération de l'employé ${id}:`, error);
        return of(undefined);
      })
    );
  }

  addSalarie(salarie: Partial<Salarie>): Observable<Salarie> {
    const employee = {
      name: salarie.nom,
      matricule: salarie.matricule,
      poste: salarie.poste,
      departement: salarie.departement,
      startDate: salarie.dateEmbauche,
      client_id: salarie.clientId
    };

    return this.http.post<any>(this.apiUrl, employee).pipe(
      map(emp => ({
        id: emp.id,
        nom: emp.name,
        matricule: emp.matricule || '',
        poste: emp.poste || '',
        departement: emp.departement || '',
        dateEmbauche: emp.startDate || '',
        clientId: emp.client_id
      })),
      catchError(error => {
        console.error('Erreur lors de l\'ajout de l\'employé:', error);
        throw error;
      })
    );
  }

  updateSalarie(salarie: Salarie): Observable<Salarie> {
    const employee = {
      name: salarie.nom,
      matricule: salarie.matricule,
      poste: salarie.poste,
      departement: salarie.departement,
      startDate: salarie.dateEmbauche,
      client_id: salarie.clientId
    };

    return this.http.put<any>(`${this.apiUrl}/${salarie.id}`, employee).pipe(
      map(emp => ({
        id: emp.id,
        nom: emp.name,
        matricule: emp.matricule || '',
        poste: emp.poste || '',
        departement: emp.departement || '',
        dateEmbauche: emp.startDate || '',
        clientId: emp.client_id
      })),
      catchError(error => {
        console.error(`Erreur lors de la mise à jour de l'employé ${salarie.id}:`, error);
        throw error;
      })
    );
  }

  deleteSalarie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Erreur lors de la suppression de l'employé ${id}:`, error);
        throw error;
      })
    );
  }
}
