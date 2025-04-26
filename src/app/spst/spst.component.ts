import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';

@Component({
  selector: 'app-spst',
  standalone: true,
  imports: [CommonModule, SidebarClientComponent],
  templateUrl: './spst.component.html',
  styleUrls: ['./spst.component.css']
})
export class SpstComponent {
  sidebarCollapsed = false;

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
}
