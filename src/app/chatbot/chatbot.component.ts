import { Component, EventEmitter, Output, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../authservice/theme.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements AfterViewChecked, OnInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  userMessage: string = '';
  messages: { role: 'user' | 'assistant', content: string }[] = [];
  isLoading: boolean = false;
  isModalVisible: boolean = true; // Toujours visible par défaut
  showChatbot: boolean = true;
  isDarkMode$;
  
  constructor(
    private http: HttpClient,
    private themeService: ThemeService
  ) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit() {
    // Ajouter un message de bienvenue par défaut
    this.messages.push({ 
      role: 'assistant', 
      content: 'Bonjour ! Je suis l\'assistant VigiScope. Comment puis-je vous aider aujourd\'hui ?' 
    });
  }

  @Output() close = new EventEmitter<void>();

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  stopClickPropagation(event: Event) {
    event.stopPropagation(); // Empêche la fermeture de la modale quand on clique à l'intérieur
  }

  closeModal() {
    this.isModalVisible = false;
    this.close.emit(); // Émet l'événement de fermeture
    this.showChatbot = false; // Masque le chatbot
  }

  startNewChat() {
    // Réinitialiser les messages
    this.messages = [];
    // Ajouter un message de bienvenue par défaut
    this.messages.push({ 
      role: 'assistant', 
      content: 'Bonjour ! Je suis l\'assistant VigiScope. Comment puis-je vous aider aujourd\'hui ?' 
    });
  }

  closeChatbot() {
    this.close.emit();
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ role: 'user', content: this.userMessage });
    const userPrompt = this.userMessage;
    this.userMessage = '';
    this.isLoading = true;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      });
    
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Tu es un assistant de santé pour le site VigiScope.' },
        ...this.messages
      ]
    };

    this.http.post('https://api.openai.com/v1/chat/completions', body, { headers })
      .subscribe({
        next: (res: any) => {
          const reply = res.choices[0].message.content;
          this.messages.push({ role: 'assistant', content: reply });
          this.isLoading = false;
        },
        error: (err) => {
          this.messages.push({ role: 'assistant', content: "Erreur lors de la réponse." });
          this.isLoading = false;
        }
      });
  }

  private scrollToBottom() {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }
}