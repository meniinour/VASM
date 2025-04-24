import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface User {
  id: number;
  email: string;
  created_at: string;
  name?: string;
  phone?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockUserService {
  private users: User[] = [
    { id: 1, email: 'client1@example.com', created_at: '2024-01-01' },
    { id: 2, email: 'client2@example.com', created_at: '2024-01-02' },
    { id: 3, email: 'client3@example.com', created_at: '2024-01-03' }
  ];

  constructor() {
    console.log('MockUserService initialisé');
  }

  getUsers(): Observable<User[]> {
    console.log('MockUserService: getUsers appelé');
    return of(this.users).pipe(delay(1000));
  }

  getUser(id: number): Observable<User> {
    console.log('MockUserService: getUser appelé avec id:', id);
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return of(user).pipe(delay(500));
  }

  createUser(user: Partial<User>): Observable<User> {
    console.log('MockUserService: createUser appelé avec:', user);
    const newUser: User = {
      id: this.users.length + 1,
      email: user.email || '',
      created_at: new Date().toISOString(),
      name: user.name,
      phone: user.phone,
      address: user.address
    };
    this.users.push(newUser);
    return of(newUser).pipe(delay(800));
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    console.log('MockUserService: updateUser appelé avec id:', id, 'et:', user);
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Utilisateur non trouvé');
    }
    this.users[index] = { ...this.users[index], ...user };
    return of(this.users[index]).pipe(delay(800));
  }

  deleteUser(id: number): Observable<void> {
    console.log('MockUserService: deleteUser appelé avec id:', id);
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Utilisateur non trouvé');
    }
    this.users.splice(index, 1);
    return of(void 0).pipe(delay(800));
  }
} 