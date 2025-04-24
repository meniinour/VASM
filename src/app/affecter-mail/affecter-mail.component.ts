import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MailService } from '../authservice/mail.service'; // Adjust the path as needed
import { AppComponent } from '../app.component';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MyHeaderComponent } from "../my-header/my-header.component"; // Adjust the path as needed

@Component({
  selector: 'app-affecter-mail',
  templateUrl: './affecter-mail.component.html',
  styleUrls: ['./affecter-mail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, MyHeaderComponent]
})
export class AffecterMailComponent {
goToHome() {
throw new Error('Method not implemented.');
}
  email: string = '';
  message: string = '';
  isSuccess: boolean = false;

  constructor(private mailService: MailService) {}

  affecterMails() {
    if (this.email) {
      this.mailService.affecter(this.email).subscribe(() => {
        this.isSuccess = true;
        this.message = 'Mail affecté avec succès !';
        this.email = '';
        
        setTimeout(() => {
          this.message = '';
        }, 3000);
      });
    }
  }
}

export class AppModule { } // Export the module

