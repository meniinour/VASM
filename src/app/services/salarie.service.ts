import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Salarie {
  id: number;
  nom: string;
  matricule: string;
  poste?: string;
  departement?: string;
  dateEmbauche?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalarieService {
  private salaries: Salarie[] = [
    { id: 1, nom: 'Louis Manas', matricule: '12345', poste: 'Développeur', departement: 'IT', dateEmbauche: '2022-05-15' },
    { id: 2, nom: 'Sophie Dubois', matricule: '67890', poste: 'Designer', departement: 'Créatif', dateEmbauche: '2021-11-03' },
    { id: 3, nom: 'Marc Lambert', matricule: '24680', poste: 'Chef de Projet', departement: 'Management', dateEmbauche: '2020-02-20' },
    { id: 4, nom: 'Julie Rousseau', matricule: '13579', poste: 'Comptable', departement: 'Finance', dateEmbauche: '2023-01-10' }
  ];
  
  private salarieSubject = new BehaviorSubject<Salarie[]>(this.salaries);

  constructor() { }

  getSalaries(): Observable<Salarie[]> {
    return this.salarieSubject.asObservable();
  }

  addSalarie(salarie: Omit<Salarie, 'id'>): void {
    const newId = this.salaries.length > 0 ? 
      Math.max(...this.salaries.map(s => s.id)) + 1 : 1;
    
    const newSalarie = {
      id: newId,
      ...salarie
    };
    
    this.salaries = [...this.salaries, newSalarie];
    this.salarieSubject.next(this.salaries);
  }

  updateSalarie(salarie: Salarie): void {
    this.salaries = this.salaries.map(s => 
      s.id === salarie.id ? salarie : s
    );
    this.salarieSubject.next(this.salaries);
  }

  deleteSalarie(id: number): void {
    this.salaries = this.salaries.filter(s => s.id !== id);
    this.salarieSubject.next(this.salaries);
  }

  getSalarieById(id: number): Salarie | undefined {
    return this.salaries.find(s => s.id === id);
  }
}