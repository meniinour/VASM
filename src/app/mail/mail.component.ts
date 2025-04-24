import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BesoinComponent } from '../besoin/besoin.component';
import { MyHeaderComponent } from "../my-header/my-header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MailService, Mail } from '../authservice/mail.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule, MyHeaderComponent, SidebarComponent],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.css'
})
export class MailComponent implements OnInit {
goToHome() {
throw new Error('Method not implemented.');
}
  startDateControl = new FormControl('');
  endDateControl = new FormControl('');

  title = 'VigiScope';

  // Liste des employés
  employes = [
    { id: 1, nom: 'TEST ASM' },
    { id: 2, nom: 'DEV1' },
    { id: 3, nom: 'DEV2' },
  ];

  // Supposons que l'employé connecté ait l'ID 1
  employeConnecteId = 1;

  // Récupérer le nom de l'employé connecté
  get employeConnecte() {
    return this.employes.find(emp => emp.id === this.employeConnecteId)?.nom || 'Employé non trouvé';
  }

  // Propriétés initialisées
  traitements = '0/0';
  mailsBloques: number = 0;
  mailsRecus: number = 0;
  mailsNonTraites: number = 0;

  // Historique des mails avec statut et commentaire
  historiqueMails = [
    { 
      date: '2025-03-20', 
      client: 'Client A', 
      nomPrenom: 'Jean Dupont', 
      toMail: 'jean@example.com', 
      subject: 'Demande de devis', 
      statut: 'En attente', 
      commentaire: '', 
      bloque: false, 
      traite: false,
      statutControl: new FormControl('En attente'),
      commentaireControl: new FormControl('')
    },
    { 
      date: '2025-03-21', 
      client: 'Client B', 
      nomPrenom: 'Marie Curie', 
      toMail: 'marie@example.com', 
      subject: 'Réclamation', 
      statut: 'En cours', 
      commentaire: '', 
      bloque: true, 
      traite: false,
      statutControl: new FormControl('En cours'),
      commentaireControl: new FormControl('')
    },
    { 
      date: '2025-03-22', 
      client: 'Client C', 
      nomPrenom: 'Albert Einstein', 
      toMail: 'albert@example.com', 
      subject: 'Problème technique', 
      statut: 'Terminé', 
      commentaire: '', 
      bloque: false, 
      traite: true,
      statutControl: new FormControl('Terminé'),
      commentaireControl: new FormControl('')
    }
  ];

  selectedDate: string = '';
  mailsFiltres = [...this.historiqueMails];

  // Propriétés pour le thème sombre
  isDarkMode$ = new BehaviorSubject<boolean>(false);
  showAide = false;

  mails: Mail[] = [];
  filteredMails: Mail[] = [];
  message: string = '';
  isSuccess: boolean = false;

  // Filtres
  filterClient: string = '';
  filterNom: string = '';
  filterSujet: string = '';
  filterStatus: string = '';
  filterDate: string = '';

  // Tri
  sortField: keyof Mail = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  pages: number[] = [];

  // Propriétés pour la confirmation
  selectedAction: 'affecter' | 'debloquer' | 'liberer' | 'changer' | null = null;
  confirmationId: string = '';
  showConfirmation: boolean = false;
  selectedMail: any = null;

  constructor(private router: Router, private mailService: MailService) {
    this.updateMailStats();
  }

  ngOnInit() {
    this.loadMails();
  }

  loadMails() {
    this.mailService.getMails().subscribe(
      data => {
        this.mails = data;
        this.applyFilters();
      },
      error => {
        this.isSuccess = false;
        this.message = 'Erreur lors du chargement des mails';
      }
    );
  }

  applyFilters() {
    this.filteredMails = this.mails.filter(mail => {
      return (
        (!this.filterClient || mail.client.toLowerCase().includes(this.filterClient.toLowerCase())) &&
        (!this.filterNom || mail.nom.toLowerCase().includes(this.filterNom.toLowerCase())) &&
        (!this.filterSujet || mail.sujet.toLowerCase().includes(this.filterSujet.toLowerCase())) &&
        (!this.filterStatus || mail.status === this.filterStatus) &&
        (!this.filterDate || this.formatDate(mail.date) === this.filterDate)
      );
    });

    // Appliquer le tri
    this.sortMails();
    
    // Recalculer la pagination
    this.calculatePages();
  }

  sortMails() {
    this.filteredMails.sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }

  onSort(field: keyof Mail) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortMails();
  }

  calculatePages() {
    this.totalPages = Math.ceil(this.filteredMails.length / this.itemsPerPage);
    this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange() {
    this.calculatePages();
  }

  get displayedMails(): Mail[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredMails.slice(start, end);
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  // Mettre à jour les statistiques des mails
  updateMailStats() {
    this.mailsRecus = this.historiqueMails.length;
    this.mailsNonTraites = this.historiqueMails.filter(mail => !mail.traite).length;
    this.mailsBloques = this.historiqueMails.filter(mail => mail.bloque).length;
  }

  // Méthode pour obtenir le statut du mail
  getMailStatus(mail: any): string {
    if (mail.bloque) {
      return 'Bloqué';
    } else if (mail.traite) {
      return 'Traité';
    } else {
      return 'En cours';
    }
  }

  // Filtrer les mails par date entre les dates de début et de fin
  filtrerParDate() {
    const startDate = this.startDateControl.value;
    const endDate = this.endDateControl.value;
    
    if (startDate && endDate) {
      this.mailsFiltres = this.historiqueMails.filter(mail => {
        const mailDate = new Date(mail.date);
        return mailDate >= new Date(startDate) && mailDate <= new Date(endDate);
      });
    } else {
      this.mailsFiltres = [...this.historiqueMails];
    }
  }

  // Méthodes de gestion des mails
  affecterMails() {
    this.router.navigate(['/affecter-mail']);
  }

  debloquerMails() {
    this.router.navigate(['/liberer-mail']);
  }

  libererMails() {
    this.router.navigate(['/liberer-mail']);
  }

  // Méthode pour sauvegarder un mail
  sauvegarderMail(mail: any) {
    mail.statut = mail.statutControl.value;
    mail.commentaire = mail.commentaireControl.value;
    console.log('Sauvegarder le mail', mail);
  }

  // Méthode pour basculer le thème
  toggleTheme() {
    const currentMode = this.isDarkMode$.value;
    this.isDarkMode$.next(!currentMode);
    document.body.classList.toggle('dark-mode');
  }

  // Actions sur les mails
  affecter(mail: Mail) {
    this.mailService.affecter(mail.email).subscribe(
      res => {
        this.isSuccess = res.success;
        this.message = res.message;
        if (res.success) this.loadMails();
        setTimeout(() => this.message = '', 3000);
      }
    );
  }

  bloquer(mail: Mail) {
    this.mailService.bloquer(mail.id).subscribe(
      res => {
        this.isSuccess = res.success;
        this.message = res.message;
        if (res.success) this.loadMails();
        setTimeout(() => this.message = '', 3000);
      }
    );
  }

  liberer(mail: Mail) {
    this.mailService.liberer(mail.id).subscribe(
      res => {
        this.isSuccess = res.success;
        this.message = res.message;
        if (res.success) this.loadMails();
        setTimeout(() => this.message = '', 3000);
      }
    );
  }

  resetFilters() {
    this.filterClient = '';
    this.filterNom = '';
    this.filterSujet = '';
    this.filterStatus = '';
    this.filterDate = '';
    this.applyFilters();
  }

  // Méthodes pour la gestion des actions
  demanderConfirmation(mail: any, action: 'affecter' | 'debloquer' | 'liberer' | 'changer') {
    this.selectedAction = action;
    this.selectedMail = mail;
    this.showConfirmation = true;
    this.confirmationId = '';
  }

  confirmerAction() {
    if (!this.confirmationId) {
      alert('Veuillez entrer un ID');
      return;
    }

    // Vérifier si l'ID correspond à l'employé connecté
    if (this.confirmationId !== this.employeConnecteId.toString()) {
      alert('ID invalide');
      return;
    }

    switch (this.selectedAction) {
      case 'affecter':
        this.affecterMails();
        break;
      case 'debloquer':
        this.debloquerMails();
        break;
      case 'liberer':
        this.libererMails();
        break;
      case 'changer':
        if (this.selectedMail) {
          this.selectedMail.traite = !this.selectedMail.traite;
          this.selectedMail.bloque = false;
          this.updateMailStats();
        }
        break;
    }

    this.showConfirmation = false;
    this.selectedAction = null;
    this.selectedMail = null;
    this.confirmationId = '';
  }

  annulerAction() {
    this.showConfirmation = false;
    this.selectedAction = null;
    this.selectedMail = null;
    this.confirmationId = '';
  }
}
