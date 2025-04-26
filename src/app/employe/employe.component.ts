import { Component  } from '@angular/core';
import { DocumentationComponent } from "../documentation/documentation.component";
import { MyHeaderComponent } from "../my-header/my-header.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-employe',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MyHeaderComponent, DocumentationComponent],
  templateUrl: './employe.component.html',
  styleUrl: './employe.component.css'
})
export class EmployeComponent {
  companyName = "TechSolutions Inc.";
  employee = {
    name: "John Smith",
    position: "Administrator",
    avatar: "assets/user-icon.png" // Icône de l'employé
  };
  
  notifications = [
    { id: 1, icon: "email", message: "Nouveau message de l'équipe", time: "10 min" },
    { id: 2, icon: "warning", message: "Rapport mensuel dû", time: "1h" },
    { id: 3, icon: "check_circle", message: "Tâche complétée", time: "2h" }
  ];

  showProfile() {
    console.log("Afficher le profil");
    // Logic to navigate to profile page
  }

  openSettings() {
    console.log("Ouvrir les paramètres");
    // Logic to open settings page
  }
  logout() {
    console.log("Déconnexion");
    // Logic for logout
  }

}