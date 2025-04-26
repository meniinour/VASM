import { Component } from '@angular/core';
import { DocumentationComponent } from "../documentation/documentation.component";
import { MyHeaderComponent } from "../my-header/my-header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uprof',
  imports: [MyHeaderComponent,CommonModule],
  standalone: true,
  templateUrl: './uprof.component.html',
  styleUrl: './uprof.component.css'
})
export class UprofComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}
