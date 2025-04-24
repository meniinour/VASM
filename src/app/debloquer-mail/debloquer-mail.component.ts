import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MyHeaderComponent } from "../my-header/my-header.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MailBloque {
  id: number;
  date: string;
  client: string;
  nom: string;
  sujet: string;
  traitement: string;
  dateTraitement: string;
  commentaire: string;
}

@Component({
  selector: 'app-debloquer-mail',
  templateUrl: './debloquer-mail.component.html',
  styleUrls: ['./debloquer-mail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, MyHeaderComponent]
})
export class DebloquerMailComponent implements OnInit {
goToHome() {
throw new Error('Method not implemented.');
}
  mailsBloques: MailBloque[] = [];
  message: string = '';
  isSuccess: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMailsBloques();
  }

  loadMailsBloques() {
    this.http.get<MailBloque[]>('http://localhost:8000/api/mails-bloques')
      .subscribe(
        data => {
          this.mailsBloques = data;
          this.calculatePages();
        },
        error => {
          this.isSuccess = false;
          this.message = 'Erreur lors du chargement des mails bloqués';
        }
      );
  }

  calculatePages() {
    this.totalPages = Math.ceil(this.mailsBloques.length / this.itemsPerPage);
    this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.calculatePages();
  }

  debloquer(id: number) {
    this.http.post<any>('http://localhost:8000/api/debloquer', { id })
      .subscribe(
        res => {
          this.isSuccess = true;
          this.message = res.message || 'Mail débloqué avec succès !';
          this.loadMailsBloques(); // Recharger la liste
          
          // Réinitialiser le message après 3 secondes
          setTimeout(() => {
            this.message = '';
          }, 3000);
        },
        error => {
          this.isSuccess = false;
          this.message = 'Erreur lors du déblocage du mail';
        }
      );
  }

  get displayedMails(): MailBloque[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.mailsBloques.slice(start, end);
  }
}
