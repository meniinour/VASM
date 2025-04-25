import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms'; // ✅ À importer
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from '../authservice/auth.service'; // Assurez-vous que le chemin est correct
import { HttpClientModule } from '@angular/common/http';  // Assure-toi d'importer HttpClientModule
import { ChatbotComponent } from '../chatbot/chatbot.component';  // Ajoute cette ligne d'import
import { BesoinComponent } from '../besoin/besoin.component';  // Si besoin de BesoinComponent
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ThemeService } from '../authservice/themeService';
import { MyHeaderComponent } from "../my-header/my-header.component"; // Import du ThemeService

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, ChatbotComponent, MyHeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MsalService]
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  email = '';
  password = '';
  showChatbot = false;
  showBesoin = false;
  showAide = false;
  isDarkMode$;
  isModalVisible = false;
  userMessage = '';
  messages: { role: 'user' | 'assistant', content: string }[] = [];
  isLoading = false;
  showNotification = true;
  showPassword = false; // Nouvelle propriété pour gérer la visibilité du mot de passe

  // Données de connexion manuelles pour les tests
  testAccounts = [
    { email: 'admin@vigiscope.com', password: 'admin123', role: 'Administrateur' },
    { email: 'user@vigiscope.com', password: 'user123', role: 'Utilisateur' },
    { email: 'manager@vigiscope.com', password: 'manager123', role: 'Manager' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    private msalService: MsalService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
    
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }
  
  ngOnInit() {
    // Afficher uniquement la notification après 2 secondes
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
  
  // Méthode pour basculer le thème
  toggleTheme() {
    // Basculer entre le mode clair et le mode sombre
    this.themeService.toggleTheme();
  }
  
  // Méthode pour basculer la visibilité du mot de passe
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  register() {
    this.router.navigate(['/register']); // Redirection vers la page d'inscription
  }
    goToForgotPassword() {
      this.router.navigate(['/forget-password']);
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

    goToBesoin(): void {
      this.router.navigate(['/besoin']); // Redirection vers la page d'aide
      this.showBesoin = true;  // Quand l'utilisateur clique, l'aide devient visible
      this.showAide = true; // Afficher le composant d'aide
    }
    
    loginWithSSO() {
      // Implémentation de la connexion SSO
      console.log('Connexion SSO'); 
    }

  // Fonction de connexion avec Microsoft (en supposant une intégration OAuth ou MSAL)
  loginWithMicrosoft() {
    // Redirection vers la page d'accueil après la connexion Microsoft
    this.router.navigate(['/home']);
  }

  // Méthode pour utiliser un compte de test
  useTestAccount(account: { email: string, password: string }) {
    this.loginForm.patchValue({
      email: account.email,
      password: account.password
    });
  }

  // Soumission du formulaire de connexion
  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
  
      this.authService.login(loginData.email, loginData.password).subscribe(
        (response: any) => {
          console.log('Connexion réussie', response);
          localStorage.setItem('token', response.token); // Stocker le token dans sessionStorage pour plus de sécurité
          this.router.navigate(['/home']); // Redirection
        },
        (error: any) => {
          console.error('Erreur de connexion', error);
          this.errorMessage = error.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
        
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }

  closeModal() {
    this.isModalVisible = false;
  }

  stopClickPropagation(event: Event) {
    event.stopPropagation();
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
    this.showNotification = false; // Cacher la notification une fois le chatbot ouvert
  }
}  

