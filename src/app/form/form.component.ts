import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  gestionnaireForm!: FormGroup;
  submitted = false;
  showPassword = false;
  
  optionsClassificationMails = [
    { value: 'inbox', label: 'Tri des mails entrants' },
    { value: 'prioritization', label: 'Priorisation des messages' },
    { value: 'categorization', label: 'Catégorisation par thématique' },
    { value: 'response', label: 'Réponses automatiques' },
    { value: 'forwarding', label: 'Transfert aux services concernés' }
  ];
  
  optionsGestionTaches = [
    { value: 'creation', label: 'Création de tâches' },
    { value: 'assignment', label: 'Attribution aux équipes' },
    { value: 'tracking', label: 'Suivi d\'avancement' },
    { value: 'reporting', label: 'Génération de rapports' },
    { value: 'deadline', label: 'Gestion des échéances' }
  ];
  
  niveauxAcces = [
    { value: 'junior', label: 'Junior - Accès limité' },
    { value: 'standard', label: 'Standard - Accès général' },
    { value: 'senior', label: 'Senior - Accès étendu' },
    { value: 'admin', label: 'Administrateur - Accès complet' }
  ];
  
  constructor(private formBuilder: FormBuilder) { }
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.gestionnaireForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)],
      identifiant: ['', [Validators.required, Validators.minLength(5)]],
      motDePasse: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      ]],
      classificationMails: this.buildCheckboxes(this.optionsClassificationMails),
      gestionTaches: this.buildCheckboxes(this.optionsGestionTaches),
      niveauAcces: ['', Validators.required],
      commentaires: ['']
    });
  }
  
  buildCheckboxes(options: any[]): FormArray {
    const arr = options.map(() => this.formBuilder.control(false));
    return this.formBuilder.array(arr);
  }
  
  get f() { 
    return this.gestionnaireForm.controls; 
  }
  
  get classificationMailsArray() {
    return this.gestionnaireForm.get('classificationMails') as FormArray;
  }
  
  get gestionTachesArray() {
    return this.gestionnaireForm.get('gestionTaches') as FormArray;
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.gestionnaireForm.invalid) {
      return;
    }
    
    // Préparer les données du formulaire
    const formData = {
      ...this.gestionnaireForm.value,
      classificationMails: this.getSelectedCheckboxValues(
        this.gestionnaireForm.value.classificationMails,
        this.optionsClassificationMails
      ),
      gestionTaches: this.getSelectedCheckboxValues(
        this.gestionnaireForm.value.gestionTaches,
        this.optionsGestionTaches
      )
    };
    
    console.log('Données du gestionnaire soumises:', formData);
    
    // Ici, vous pouvez appeler un service pour envoyer les données au backend
    // this.gestionnaireService.ajouterGestionnaire(formData).subscribe(...);
    
    // Afficher un message de confirmation (à adapter selon votre système de notifications)
    alert('Gestionnaire ajouté avec succès!');
    
    this.onReset();
  }
  
  getSelectedCheckboxValues(selectedValues: boolean[], options: any[]): string[] {
    return selectedValues
      .map((checked, index) => checked ? options[index].value : null)
      .filter(value => value !== null);
  }
  
  onReset(): void {
    this.submitted = false;
    this.gestionnaireForm.reset();
    
    // Réinitialisation des cases à cocher
    this.optionsClassificationMails.forEach((_, i) => {
      this.classificationMailsArray.at(i).setValue(false);
    });
    
    this.optionsGestionTaches.forEach((_, i) => {
      this.gestionTachesArray.at(i).setValue(false);
    });
  }
}