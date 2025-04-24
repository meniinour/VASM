import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, MyHeaderComponent, ChatbotComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showChatbot = false;
  showNotification = false;
  messages: { role: 'user' | 'assistant', content: string }[] = [];
  userMessage = '';
  isLoading = false;

  ngOnInit() {
    // Afficher uniquement la notification aprè s 2 secondes
    setTimeout(() => {
      this.showNotification = true;
    }, 1000);
  }

  toggleChatbot() {
    this.showChatbot = !this.showChatbot;
    this.showNotification = false;
    if (this.showChatbot) {
      this.startNewChat();
    }
  }

  closeChatbot() {
    this.showChatbot = false;
  }

  startNewChat() {
    this.messages = [];
    this.messages.push({ 
      role: 'assistant', 
      content: 'Bonjour ! Je suis l\'assistant VigiScope. Comment puis-je vous aider aujourd\'hui ?' 
    });
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ role: 'user', content: this.userMessage });
    this.userMessage = '';
    this.isLoading = true;

    // Simuler une réponse après un délai
    setTimeout(() => {
      this.messages.push({ 
        role: 'assistant', 
        content: 'Je suis désolé, je suis en maintenance pour le moment. Veuillez réessayer plus tard.' 
      });
      this.isLoading = false;
    }, 1000);
  }

  closeNotification() {
    this.showNotification = false;
  }

  openChatbot() {
    this.showChatbot = true;
    this.messages = [{
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant VigiScope. Comment puis-je vous aider aujourd\'hui ?'
    }];
    this.showNotification = false;
  }
}
