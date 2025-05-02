import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { MyHeaderComponent } from '../my-header/my-header.component';

interface Mail {
  id: number;
  sender: string;
  senderEmail: string;
  recipient: string;
  recipientEmail: string;
  subject: string;
  content: string;
  date: Date;
  read: boolean;
  status?: 'sent' | 'opened' | 'replied' | 'failed';
  attachments?: { name: string, url: string }[];
  selected?: boolean;
}

@Component({
  selector: 'app-mail-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarClientComponent, MyHeaderComponent],
  templateUrl: './mail-client.component.html',
  styleUrls: ['./mail-client.component.css'],
})
export class MailClientComponent implements OnInit {
  sidebarCollapsed = false;
  mails: Mail[] = [];
  displayedMails: Mail[] = [];
  selectedMail: Mail | null = null;
  selectedMails: Mail[] = [];
  searchText: string = '';
  mailForm: FormGroup;
  showNewMailModal = false;
  isReply: boolean = false;
  isForward: boolean = false;
  currentFilter: string = 'all';
  currentSort: string = 'date';
  unreadCount: number = 0;
  emptyStateMessage: string = 'Your mailbox is empty.';

  constructor(private fb: FormBuilder) {
    this.mailForm = this.fb.group({
      recipientEmail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMails();
    this.updateUnreadCount();
  }

  loadMails() {
    // Sample mail data
    this.mails = [
      {
        id: 1,
        sender: 'Sophie Moreau',
        senderEmail: 'sophie.moreau@example.com',
        recipient: 'Louis MANAS',
        recipientEmail: 'louis.manas@example.com',
        subject: 'Upcoming VIPP Visit',
        content: 'Bonjour Louis,\n\nCeci est un rappel de votre visite VIPP prévue pour le 15 mai. Veuillez confirmer votre présence avant le 10 mai. Le programme détaillé est joint à cet email.\n\nCordialement,\nSophie Moreau\nDirectrice des Relations Clients',
        date: new Date(),
        read: false,
        status: 'sent',
        attachments: [
          { name: 'programme_vipp.pdf', url: '#' },
          { name: 'plan_acces.pdf', url: '#' }
        ]
      },
      {
        id: 2,
        sender: 'Jean Dupont',
        senderEmail: 'jean.dupont@example.com',
        recipient: 'Louis MANAS',
        recipientEmail: 'louis.manas@example.com',
        subject: 'Rapport mensuel - Avril 2025',
        content: 'Cher Louis,\n\nVous trouverez ci-joint le rapport mensuel d\'activité pour le mois d\'avril 2025. Les chiffres sont en hausse de 15% par rapport au mois précédent.\n\nN\'hésitez pas à me contacter si vous avez des questions.\n\nCordialement,\nJean Dupont\nAnalyste Financier',
        date: new Date(new Date().setDate(new Date().getDate() - 2)),
        read: true,
        status: 'opened',
        attachments: [
          { name: 'rapport_avril_2025.xlsx', url: '#' }
        ]
      },
      {
        id: 3,
        sender: 'Marie Laurent',
        senderEmail: 'marie.laurent@example.com',
        recipient: 'Louis MANAS',
        recipientEmail: 'louis.manas@example.com',
        subject: 'Invitation - Conférence annuelle',
        content: 'Cher Louis,\n\nJ\'ai le plaisir de vous inviter à notre conférence annuelle qui se tiendra le 25 juin 2025 à Paris. Cette année, nous aborderons les thèmes de l\'innovation et du développement durable.\n\nMerci de confirmer votre participation avant le 1er juin.\n\nBien cordialement,\nMarie Laurent\nResponsable Événementiel',
        date: new Date(new Date().setDate(new Date().getDate() - 4)),
        read: false,
        status: 'sent',
        attachments: [
          { name: 'invitation_conference.pdf', url: '#' },
          { name: 'programme_conference.pdf', url: '#' }
        ]
      },
      {
        id: 4,
        sender: 'Pierre Martin',
        senderEmail: 'pierre.martin@example.com',
        recipient: 'Louis MANAS',
        recipientEmail: 'louis.manas@example.com',
        subject: 'Mise à jour du projet Alpha',
        content: 'Bonjour Louis,\n\nJe vous informe que le projet Alpha a été mis à jour avec les dernières fonctionnalités demandées. La documentation technique est disponible dans le dossier partagé.\n\nUne démo est prévue vendredi à 14h.\n\nCordialement,\nPierre Martin\nChef de Projet',
        date: new Date(new Date().setDate(new Date().getDate() - 5)),
        read: true,
        status: 'replied',
        attachments: []
      },
      {
        id: 5,
        sender: 'Claire Dubois',
        senderEmail: 'claire.dubois@example.com',
        recipient: 'Louis MANAS',
        recipientEmail: 'louis.manas@example.com',
        subject: 'Demande de congés',
        content: 'Bonjour Louis,\n\nJe souhaiterais poser des congés du 10 au 17 juillet 2025 inclus. Pourriez-vous me donner votre accord ?\n\nMerci d\'avance,\nClaire Dubois\nAssistante Administrative',
        date: new Date(new Date().setDate(new Date().getDate() - 7)),
        read: false,
        status: 'sent',
        attachments: []
      }
    ];
    
    this.displayedMails = [...this.mails];
    this.sortMails();
  }

  selectMail(mail: Mail) {
    this.selectedMail = mail;
    if (!mail.read) {
      mail.read = true;
      this.updateUnreadCount();
    }
  }

  updateUnreadCount() {
    this.unreadCount = this.mails.filter(mail => !mail.read).length;
  }

  filterMails() {
    // First apply search filter
    let filtered = this.mails;
    
    if (this.searchText.trim() !== '') {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(mail => 
        mail.subject.toLowerCase().includes(searchLower) ||
        mail.sender.toLowerCase().includes(searchLower) ||
        mail.content.toLowerCase().includes(searchLower)
      );
    }
    
    // Then apply read/unread filter
    if (this.currentFilter === 'unread') {
      filtered = filtered.filter(mail => !mail.read);
    } else if (this.currentFilter === 'read') {
      filtered = filtered.filter(mail => mail.read);
    }
    
    this.displayedMails = filtered;
    this.sortMails();
    
    // Update empty state message
    if (this.displayedMails.length === 0) {
      if (this.searchText.trim() !== '') {
        this.emptyStateMessage = `No emails found matching "${this.searchText}".`;
      } else if (this.currentFilter === 'unread') {
        this.emptyStateMessage = 'No unread emails.';
      } else if (this.currentFilter === 'read') {
        this.emptyStateMessage = 'No read emails.';
      } else {
        this.emptyStateMessage = 'Your mailbox is empty.';
      }
    }
  }
  
  sortMails() {
    switch (this.currentSort) {
      case 'date':
        this.displayedMails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date-asc':
        this.displayedMails.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'sender':
        this.displayedMails.sort((a, b) => a.sender.localeCompare(b.sender));
        break;
      case 'subject':
        this.displayedMails.sort((a, b) => a.subject.localeCompare(b.subject));
        break;
      default:
        this.displayedMails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  refreshMails() {
    // Simulate refreshing emails
    this.loadMails();
    this.selectedMail = null;
    this.selectedMails = [];
    this.updateUnreadCount();
  }

  sendMail() {
    if (this.mailForm.valid) {
      const now = new Date();
      const newMail: Mail = {
        id: this.mails.length + 1,
        sender: 'Louis MANAS',
        senderEmail: 'louis.manas@example.com',
        recipient: '',
        recipientEmail: this.mailForm.value.recipientEmail,
        subject: this.mailForm.value.subject,
        content: this.mailForm.value.content,
        date: now,
        read: true,
        status: 'sent'
      };
      
      // Add the new mail to the top of the list
      this.mails.unshift(newMail);
      
      // Refresh displayed mails
      this.filterMails();
      
      // Close modal and reset form
      this.showNewMailModal = false;
      this.mailForm.reset();
      this.isReply = false;
      this.isForward = false;
      
      // Show success message
      alert('Mail sent successfully!');
    } else {
      // Trigger validation messages
      Object.keys(this.mailForm.controls).forEach(key => {
        const control = this.mailForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  cancelMail() {
    this.showNewMailModal = false;
    this.mailForm.reset();
    this.isReply = false;
    this.isForward = false;
  }

  replyToMail(mail: Mail) {
    this.isReply = true;
    this.isForward = false;
    this.showNewMailModal = true;
    
    this.mailForm.patchValue({
      recipientEmail: mail.senderEmail,
      subject: `Re: ${mail.subject}`,
      content: `\n\n-------- Original Message --------\nFrom: ${mail.sender} <${mail.senderEmail}>\nDate: ${mail.date.toLocaleString()}\nSubject: ${mail.subject}\n\n${mail.content}`
    });
  }

  forwardMail(mail: Mail) {
    this.isReply = false;
    this.isForward = true;
    this.showNewMailModal = true;
    
    this.mailForm.patchValue({
      recipientEmail: '',
      subject: `Fwd: ${mail.subject}`,
      content: `\n\n-------- Original Message --------\nFrom: ${mail.sender} <${mail.senderEmail}>\nTo: ${mail.recipient} <${mail.recipientEmail}>\nDate: ${mail.date.toLocaleString()}\nSubject: ${mail.subject}\n\n${mail.content}`
    });
  }

  deleteMail(mail: Mail) {
    if (confirm('Are you sure you want to delete this email?')) {
      const index = this.mails.findIndex(m => m.id === mail.id);
      if (index !== -1) {
        this.mails.splice(index, 1);
        if (this.selectedMail === mail) {
          this.selectedMail = null;
        }
        this.filterMails();
        this.updateUnreadCount();
      }
    }
  }

  markAsRead() {
    if (this.selectedMails.length > 0) {
      this.selectedMails.forEach(mail => {
        mail.read = true;
      });
      this.selectedMails = [];
      this.updateUnreadCount();
      this.filterMails();
    }
  }

  deleteMails() {
    if (this.selectedMails.length > 0 && confirm(`Are you sure you want to delete ${this.selectedMails.length} emails?`)) {
      this.mails = this.mails.filter(mail => !this.selectedMails.includes(mail));
      if (this.selectedMails.includes(this.selectedMail as Mail)) {
        this.selectedMail = null;
      }
      this.selectedMails = [];
      this.filterMails();
      this.updateUnreadCount();
    }
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  } }