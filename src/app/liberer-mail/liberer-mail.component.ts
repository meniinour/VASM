import { Component, OnInit } from '@angular/core';
import { MailService } from '../authservice/mail.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyHeaderComponent } from "../my-header/my-header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-liberer-mail',
  templateUrl: './liberer-mail.component.html',
  styleUrls: ['./liberer-mail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MyHeaderComponent, SidebarComponent]
})
export class LibererMailComponent implements OnInit {
goToHome() {
throw new Error('Method not implemented.');
}
  affectations: any[] = [];
  message: string = '';
  isSuccess: boolean = false;

  constructor(private mailService: MailService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.mailService.getAffectations().subscribe((data: any) => {
      this.affectations = data;
    });
  }

  liberer(id: number) {
    this.mailService.liberer(id).subscribe(() => {
      this.isSuccess = true;
      this.message = 'Mail libéré avec succès !';
      this.loadData();
      
      // Réinitialiser le message après 3 secondes
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }, error => {
      this.isSuccess = false;
      this.message = 'Erreur lors de la libération du mail';
    });
  }

  debloquer(id: number) {
    this.mailService.debloquer(id).subscribe(() => {
      this.isSuccess = true;
      this.message = 'Mail débloqué avec succès !';
      this.loadData();
      
      // Réinitialiser le message après 3 secondes
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }, error => {
      this.isSuccess = false;
      this.message = 'Erreur lors du déblocage du mail';
    });
  }
}
