// src/app/my-content/my-content.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MyHeaderComponent } from "../my-header/my-header.component";

interface Email {
  id: string;
  sender: string;
  subject: string;
  date: string;
  content: string;
  status: 'pending' | 'processed' | 'rejected';
}

@Component({
  selector: 'app-my-content',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, MyHeaderComponent],
  templateUrl: './my-content.component.html',
  styleUrls: ['./my-content.component.css']
})
export class MyContentComponent implements OnInit {
  selectedEmail: Email | null = null;
  emails: Email[] = []; // Sera rempli par l'API
  loading: boolean = true;
  error: string | null = null;
  isActionPanelVisible: boolean = false;
  searchTerm: string = '';

  // Simulation de données en attendant le backend
  ngOnInit() {
    // Ceci sera remplacé par un appel API
    this.fetchEmails();
  }

  async fetchEmails() {
    try {
      console.log('Début du chargement des emails');
      this.loading = true;
      // À remplacer par votre vrai appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.emails = [
        {
          id: '1',
          sender: 'contact@expleo.com',
          subject: 'Nouvelle demande de validation',
          date: new Date().toLocaleDateString(),
          content: 'Contenu du mail...',
          status: 'pending'
        },
        {
          id: '2',
          sender: 'rh@assystem.com',
          subject: 'Demande de traitement VM',
          date: new Date().toLocaleDateString(),
          content: 'Contenu du mail...',
          status: 'pending'
        },
        {
          id: '3',
          sender: 'spst@expleo.com',
          subject: 'Information SPST',
          date: new Date().toLocaleDateString(),
          content: 'Contenu du mail...',
          status: 'pending'
        }
      ];
      console.log('Emails chargés avec succès:', this.emails);
      this.loading = false;
    } catch (error) {
      console.error('Erreur lors du chargement des emails:', error);
      this.error = 'Erreur lors du chargement des emails';
      this.loading = false;
    }
  }

  selectEmail(email: Email): void {
    this.selectedEmail = email;
    setTimeout(() => {
      this.isActionPanelVisible = true;
    }, 100);
  }

  async processEmail(action: 'validate' | 'reject') {
    if (!this.selectedEmail) return;

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // À remplacer par votre vrai appel API
      this.selectedEmail.status = action === 'validate' ? 'processed' : 'rejected';
      
      // Rafraîchir la liste
      await this.fetchEmails();
      
      this.selectedEmail = null;
    } catch (error) {
      console.error('Erreur lors du traitement de l\'email');
    }
  }

  filterEmails(): Email[] {
    if (!this.searchTerm) return this.emails;
    const search = this.searchTerm.toLowerCase();
    return this.emails.filter(email => 
      email.sender.toLowerCase().includes(search) ||
      email.subject.toLowerCase().includes(search)
    );
  }
}
