import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ThemeService } from '../authservice/theme.service';
import { BesoinComponent } from '../besoin/besoin.component';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BesoinComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {

  forgetForm!: FormGroup;
  resetForm!: FormGroup;

  message: string = '';
  resetMessage: string = '';
  isPasswordReset: boolean = false;
  isDarkMode$;
  showAide = false;
  showBesoin = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit(): void {
    // Initialisation des formulaires au chargement
    this.initForms();
    console.log('ForgetPasswordComponent chargé !');

    // Vérifier si un token de réinitialisation est présent dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.isPasswordReset = true;
    }
  }

  // Initialise les deux formulaires
  private initForms(): void {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
  
  goToBesoin(): void {
    this.router.navigate(['/besoin']); // Redirection vers la page d'aide
    this.showBesoin = true;  // Quand l'utilisateur clique, l'aide devient visible
    this.showAide = true; // Afficher le composant d'aide
  }

  // Soumission du formulaire d'email
  onSubmit(): void {
    if (this.forgetForm.invalid) {
      this.message = 'Veuillez entrer une adresse email valide.';
      return;
    }

    const email = this.forgetForm.value.email;
    this.message = `Un lien de réinitialisation a été envoyé à ${email}`;
    this.isPasswordReset = true;
  }

  // Soumission du formulaire de réinitialisation
  resetPassword(): void {
    if (this.resetForm.invalid) {
      this.resetMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;

    if (newPassword !== confirmPassword) {
      this.resetMessage = 'Les mots de passe ne correspondent pas. Veuillez réessayer.';
      return;
    }

    this.resetMessage = 'Votre mot de passe a été réinitialisé avec succès !';

    // Logique d'appel API backend ici si nécessaire

    // Rediriger vers la page de connexion après un délai
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
