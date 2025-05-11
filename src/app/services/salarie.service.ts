import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

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
  private apiUrl = 'http://localhost:8000/api/employees';
  private salariesSubject = new BehaviorSubject<Salarie[]>([]);

  // HTTP options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // Initial load of employees
    this.loadEmployees();
  }

  // Load all employees from the backend
  private loadEmployees(): void {
    this.http.get<any>(this.apiUrl)
      .pipe(
        map(response => {
          // If the API returns a data property, extract it, otherwise use the response directly
          const employees = response.data ? response.data : response;

          // Map backend properties to Salarie interface
          return employees.map((employee: any) => ({
            id: employee.id,
            nom: employee.name,
            matricule: employee.matricule || '',
            poste: employee.poste || employee.role,
            departement: employee.departement,
            dateEmbauche: employee.startDate || employee.date_embauche
          }));
        }),
        catchError(this.handleError<Salarie[]>('loadEmployees', []))
      )
      .subscribe(employees => {
        this.salariesSubject.next(employees);
      });
  }

  // Get all employees as an observable
  getSalaries(): Observable<Salarie[]> {
    return this.salariesSubject.asObservable();
  }

  // Get a specific employee by ID
  getSalarieById(id: number): Observable<Salarie> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const employee = response.data ? response.data : response;

        // Map backend properties to Salarie interface
        return {
          id: employee.id,
          nom: employee.name,
          matricule: employee.matricule || '',
          poste: employee.poste || employee.role,
          departement: employee.departement,
          dateEmbauche: employee.startDate || employee.date_embauche
        };
      }),
      catchError(this.handleError<Salarie>(`getSalarieById id=${id}`))
    );
  }

  // Add a new employee
  addSalarie(salarie: Omit<Salarie, 'id'>): Observable<Salarie> {
    // Map frontend to backend property names
    const employeeData = {
      name: salarie.nom,
      matricule: salarie.matricule,
      poste: salarie.poste,
      departement: salarie.departement,
      startDate: salarie.dateEmbauche,
      // Add client_id or other required fields
      client_id: 1 // Default client ID, adjust as needed
    };

    return this.http.post<any>(this.apiUrl, employeeData, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const newEmployee = response.data ? response.data : response;

        // Map backend properties to Salarie interface
        const newSalarie: Salarie = {
          id: newEmployee.id,
          nom: newEmployee.name,
          matricule: newEmployee.matricule || '',
          poste: newEmployee.poste || newEmployee.role,
          departement: newEmployee.departement,
          dateEmbauche: newEmployee.startDate || newEmployee.date_embauche
        };

        // Update the local data
        const currentSalaries = this.salariesSubject.getValue();
        this.salariesSubject.next([...currentSalaries, newSalarie]);

        return newSalarie;
      }),
      catchError(this.handleError<Salarie>('addSalarie'))
    );
  }

  // Update an employee
  updateSalarie(salarie: Salarie): Observable<Salarie> {
    const url = `${this.apiUrl}/${salarie.id}`;

    // Map frontend to backend property names
    const employeeData = {
      name: salarie.nom,
      matricule: salarie.matricule,
      poste: salarie.poste,
      departement: salarie.departement,
      startDate: salarie.dateEmbauche
    };

    return this.http.put<any>(url, employeeData, this.httpOptions).pipe(
      map(response => {
        // If the API returns a data property, extract it
        const updatedEmployee = response.data ? response.data : response;

        // Map backend properties to Salarie interface
        const updatedSalarie: Salarie = {
          id: updatedEmployee.id,
          nom: updatedEmployee.name,
          matricule: updatedEmployee.matricule || '',
          poste: updatedEmployee.poste || updatedEmployee.role,
          departement: updatedEmployee.departement,
          dateEmbauche: updatedEmployee.startDate || updatedEmployee.date_embauche
        };

        // Update the local data
        const employees = this.salariesSubject.getValue();
        const index = employees.findIndex(e => e.id === salarie.id);
        if (index !== -1) {
          employees[index] = updatedSalarie;
          this.salariesSubject.next([...employees]);
        }

        return updatedSalarie;
      }),
      catchError(this.handleError<Salarie>(`updateSalarie id=${salarie.id}`))
    );
  }

  // Delete an employee
  deleteSalarie(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap(_ => {
        // Update the local data
        const employees = this.salariesSubject.getValue();
        this.salariesSubject.next(employees.filter(e => e.id !== id));
      }),
      catchError(this.handleError<void>(`deleteSalarie id=${id}`))
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
