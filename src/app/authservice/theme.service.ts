import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.setDarkMode();
    } else {
      this.setLightMode();
    }
  }

  setDarkMode() {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    this.isDarkModeSubject.next(true);
    localStorage.setItem('theme', 'dark');
  }

  setLightMode() {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    this.isDarkModeSubject.next(false);
    localStorage.setItem('theme', 'light');
  }

  toggleTheme() {
    if (this.isDarkModeSubject.value) {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }
} 