import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    // Récupérer la préférence sauvegardée ou utiliser le mode clair par défaut
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.setTheme(savedTheme === 'true');
    }
  }

  toggleTheme() {
    this.setTheme(!this.isDarkMode.value);
  }

  // Méthode publique pour forcer le mode sombre
  setDarkMode(isDark: boolean) {
    this.setTheme(isDark);
  }

  private setTheme(isDark: boolean) {
    this.isDarkMode.next(isDark);
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('darkMode', isDark.toString());
  }
} 