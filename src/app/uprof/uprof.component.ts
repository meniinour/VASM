import { Component } from '@angular/core';
import { DocumentationComponent } from "../documentation/documentation.component";
import { MyHeaderComponent } from "../my-header/my-header.component";

@Component({
  selector: 'app-uprof',
  imports: [DocumentationComponent, MyHeaderComponent],
  templateUrl: './uprof.component.html',
  styleUrl: './uprof.component.css'
})
export class UprofComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}
