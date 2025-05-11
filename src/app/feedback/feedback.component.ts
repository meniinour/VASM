import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSmile, faMeh, faFrown, faGrinStars, faStar as fasStar,
  faCheckCircle, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule, HttpClientModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  rating = 0;
  hoverRating = 0;
  justRated = false;
  submitted = false;
  isSubmitting = false;
  isAnonymous = false;
  selectedEmotion: string | null = null;
  selectedCategories: string[] = [];
  currentStep = 1;
  submissionError = false;
  errorMessage = '';

  // Font Awesome icons
  faSmile = faSmile;
  faMeh = faMeh;
  faFrown = faFrown;
  faGrinStars = faGrinStars;
  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;

  feedbackCategories: string[] = [
    'Service client',
    'Qualité',
    'Rapidité',
    'Interface utilisateur',
    'Facilité d\'utilisation',
    'Accessibilité',
    'Suggestions'
  ];

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.feedbackForm = this.fb.group({
      feedbackText: ['', [Validators.required, Validators.minLength(10)]],
      name: [''],
      email: ['', [Validators.email]],
      anonymous: [false],
      wantResponse: [false]
    });
  }

  ngOnInit(): void {
    // Vérifier si la classe host est correctement appliquée
    // Si non, on peut éventuellement l'appliquer manuellement
    const hostElement = document.querySelector('app-feedback');
    if (hostElement) {
      const styles = window.getComputedStyle(hostElement);
      if (!styles.getPropertyValue('--bg-color')) {
        console.warn('Les variables CSS ne semblent pas être appliquées. Vérifiez votre implémentation.');
      }
    }
  }

  setRating(star: number): void {
    this.rating = star;
    this.justRated = true;
    setTimeout(() => {
      this.justRated = false;
    }, 300);
  }

  selectEmotion(emotion: string): void {
    this.selectedEmotion = emotion;
  }

  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
  }

  toggleAnonymous(): void {
    this.isAnonymous = this.feedbackForm.get('anonymous')?.value;
    if (this.isAnonymous) {
      this.feedbackForm.get('name')?.clearValidators();
      this.feedbackForm.get('email')?.clearValidators();
      this.feedbackForm.get('wantResponse')?.setValue(false);
    } else {
      this.feedbackForm.get('email')?.setValidators([Validators.email]);
    }
    this.feedbackForm.get('name')?.updateValueAndValidity();
    this.feedbackForm.get('email')?.updateValueAndValidity();
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
      window.scrollTo(0, 0); // Retour en haut du formulaire
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0); // Retour en haut du formulaire
    }
  }

  onSubmit(): void {
    if (this.feedbackForm.valid && this.rating > 0) {
      this.isSubmitting = true;
      this.submissionError = false;

      // Créer l'objet feedback complet
      const feedback = {
        rating: this.rating,
        emotion: this.selectedEmotion,
        categories: this.selectedCategories,
        text: this.feedbackForm.get('feedbackText')?.value,
        anonymous: this.feedbackForm.get('anonymous')?.value,
        name: this.feedbackForm.get('name')?.value,
        email: this.feedbackForm.get('email')?.value,
        wantResponse: this.feedbackForm.get('wantResponse')?.value,
        submittedAt: new Date()
      };

      // Envoi au service API
      this.feedbackService.submitFeedback(feedback).subscribe({
        next: (response: any) => {
          console.log('Feedback envoyé avec succès:', response);
          this.submitted = true;
          this.isSubmitting = false;
        },
        error: (error: { status: number; }) => {
          console.error('Erreur lors de l\'envoi du feedback:', error);
          this.isSubmitting = false;
          this.submissionError = true;

          if (error.status === 422) {
            // Erreurs de validation
            this.errorMessage = 'Veuillez vérifier les informations saisies.';
          } else {
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          }
        }
      });
    } else {
      // Marquer les champs comme touchés pour afficher les erreurs
      this.feedbackForm.markAllAsTouched();

      if (this.rating === 0) {
        // Ajouter un message d'erreur pour la note
        this.errorMessage = 'Veuillez attribuer une note avec les étoiles.';
      }
    }
  }

  resetForm(): void {
    this.feedbackForm.reset({
      feedbackText: '',
      anonymous: false,
      wantResponse: false
    });
    this.rating = 0;
    this.selectedEmotion = null;
    this.selectedCategories = [];
    this.submitted = false;
    this.submissionError = false;
    this.currentStep = 1;
  }
}
