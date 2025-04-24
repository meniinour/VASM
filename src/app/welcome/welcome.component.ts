import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../authservice/theme.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    ChatbotComponent,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  isLoading = false;
  error: string | null = null;
  showChatbot = false;
  showBesoin = false;
  showAide = false;
  showNotification = false;
  showPassword = false;
  isDarkTheme = false;
  isModalVisible = false;
  messages: any[] = [];

  constructor(
    private router: Router,
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showNotification = true;
    }, 2000);

    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme(): void {
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
    this.showNotification = false;

    if (this.showChatbot) {
      this.startNewChat();
    }
  }

  closeChatbot(): void {
    this.showChatbot = false;
  }

  openChatbot(): void {
    this.showChatbot = true;
    this.messages = [{
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant VigiScope. Comment puis-je vous aider aujourd\'hui ?'
    }];
    this.showNotification = false;
  }

  startNewChat(): void {
    this.messages = [{
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant VigiScope. Comment puis-je vous aider aujourd\'hui ?'
    }];

    setTimeout(() => {
      this.messages.push({
        role: 'assistant',
        content: 'Je suis désolé, je suis en maintenance pour le moment. Veuillez réessayer plus tard.'
      });
      this.isLoading = false;
    }, 1000);
  }

  closeNotification(): void {
    this.showNotification = false;
  }

  goToBesoin(): void {
    this.router.navigate(['/besoin']);
    this.showBesoin = true;
    this.showAide = true;
  }

  startWorking(): void {
    console.log('Redirection vers l\'espace de travail...');
    this.router.navigate(['/home']);
  }
}
