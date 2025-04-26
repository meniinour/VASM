import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-salaries',
  standalone: true,
  imports: [CommonModule, SidebarClientComponent, RouterModule],
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.css']
})
export class SalariesComponent {
  sidebarCollapsed = false;

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
}
