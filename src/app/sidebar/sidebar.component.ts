import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatbotComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userName: string = 'Employé'; // Default name, can be updated
  showChatbot = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get user name from local storage or authentication service
    // Example:
    // this.userName = localStorage.getItem('username') || 'Employé';
  }

  testerEnregistrer(url: string, params: any, id: string) {
    this.router.navigate([url], { queryParams: params });
  }

  openChatbot() {
    this.showChatbot = true;
  }

  closeChatbot() {
    this.showChatbot = false;
  }
}