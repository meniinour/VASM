import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../authservice/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="theme-toggle" (click)="toggleTheme()">
      <i class="fas" [class.fa-moon]="!(isDarkMode$ | async)" [class.fa-sun]="isDarkMode$ | async"></i>
    </button>
  `,
  styles: [`
    .theme-toggle {
      background: none;
      border: none;
      color: var(--text-color, white);
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .theme-toggle i {
      font-size: 1.2rem;
    }

    .theme-toggle:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class ThemeToggleComponent {
  isDarkMode$;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
} 