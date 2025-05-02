import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-feedback',
  standalone: true, // Mark as standalone
  imports: [ReactiveFormsModule, CommonModule], // Add CommonModule and ReactiveFormsModule to imports
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  feedbackForm: FormGroup;
  rating = 0;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      feedbackText: ['']
    });
  }

  setRating(star: number): void {
    this.rating = star;
  }

  onSubmit(): void {
    this.submitted = true;
  }
}
