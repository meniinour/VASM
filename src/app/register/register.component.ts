import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ThemeToggleComponent } from '../shared/components/theme-toggle/theme-toggle.component';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { ThemeService } from '../authservice/theme.service';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from '../authservice/auth.service';
import { BesoinComponent } from '../besoin/besoin.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MyHeaderComponent,
    ChatbotComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  showChatbot = false;
  showBesoin = false;
  showAide = false;
  showNotification = true;
  showPassword = false;
  isDarkTheme = false;
  isDarkMode$: any;
  isModalVisible = false;
  messages: any[] = [];

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private msalService: MsalService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });

    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);

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
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
    this.messages = [];
    this.messages.push({
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant VigiScope. Comment puis-je vous aider aujourd\'hui ?'
    });

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

  loginWithMicrosoft(): void {
    // Exemple : déclencher login MSAL
    this.msalService.loginRedirect();
  }

  loginWithSSO(): void {
    console.log('Connexion SSO');
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      console.log('Formulaire soumis', this.registerForm.value);
    }
  }
}
