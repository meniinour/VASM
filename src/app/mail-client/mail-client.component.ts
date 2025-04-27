import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarClientComponent],
  templateUrl: './mail-client.component.html',
  styleUrls: ['./mail-client.component.css'],
})
export class MailClientComponent implements OnInit {
  sidebarCollapsed = false;
  mails: Mail[] = [];
  displayedMails: Mail[] = [];
  selectedMail: Mail | null = null;
  searchText: string = '';
  mailForm: FormGroup;
  showNewMailModal = false;

  constructor(private fb: FormBuilder) {
    this.mailForm = this.fb.group({
      recipientEmail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMails();
  }

  loadMails() {
    this.mails = [
      {
        id: 1,
        sender: 'Sophie Moreau',
        senderEmail: 'sophie.moreau@example.com',
        recipient: 'Louis MANAS',
        recipientEmail: 'louis.manas@example.com',
        subject: 'Upcoming VIPP Visit',
        content: 'Bonjour Louis, Ceci est un rappel de votre visite VIPP.',
        date: new Date(),
        read: false,
        status: 'sent',
        attachments: [{ name: 'brochure.pdf', url: '#' }]
      }
      // Add more sample mails here
    ];
    this.displayedMails = [...this.mails];
  }

  selectMail(mail: Mail) {
    this.selectedMail = mail;
    mail.read = true;
  }

  sendMail() {
    if (this.mailForm.valid) {
      alert('Mail sent successfully!');
      this.showNewMailModal = false;
      this.mailForm.reset();
    } else {
      alert('Please fill all required fields with valid data.');
    }
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
}
