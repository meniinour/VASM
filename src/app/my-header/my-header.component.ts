import { Component, OnInit } from '@angular/core';
import { BesoinComponent } from "../besoin/besoin.component";
import { Router } from '@angular/router';
import { ThemeService } from '../authservice/theme.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-header',
  standalone: true,
  imports: [BesoinComponent, CommonModule, RouterModule],
  templateUrl: './my-header.component.html',
  styleUrls: ['./my-header.component.css']
})
export class MyHeaderComponent implements OnInit {
  isDarkMode$!: Observable<boolean>;
  showAide = false;

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.isDarkMode$ = this.themeService.isDarkMode$;
    // Set light mode as default
    this.themeService.setLightMode();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  goToBesoin() {
    this.showAide = !this.showAide;
  }
}
