import { WelcomeComponent } from './welcome/welcome.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './authservice/auth.guard';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { BesoinComponent } from './besoin/besoin.component';
import { HttpClientModule } from '@angular/common/http';  // Assure-toi d'importer HttpClientModule
import { RegisterComponent } from './register/register.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MyHeaderComponent } from './my-header/my-header.component';
import { MyContentComponent } from './my-content/my-content.component';
import { MailComponent } from './mail/mail.component';
import { AffecterMailComponent } from './affecter-mail/affecter-mail.component';
import { DebloquerMailComponent } from './debloquer-mail/debloquer-mail.component';
import { LibererMailComponent } from './liberer-mail/liberer-mail.component';
import { UserComponent } from './users/users.component';
import { ClientAssignComponent } from './client-assign/client-assign.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarClientComponent } from './sidebar-client/sidebar-client.component';
import { MailClientComponent } from './mail-client/mail-client.component';
import { SalariesComponent } from './salaries/salaries.component';
import { AddSalarieComponent } from '../app/salaries/add-salarie/add-salarie.component';
import { ListeSalariesComponent } from '../app/salaries/liste-salaries/liste-salaries.component';
import { EditSalarieComponent } from './salaries/edit-salarie/edit-salarie.component';
import { ImportsExportsComponent } from './imports-exports/imports-exports.component';
import { StatistiquesComponent } from './statistiques/statistiques.component';
import { TableauBordComponent } from './tableau-bord/tableau-bord.component';
import { SpstComponent } from './spst/spst.component';
import { FeedbackComponent } from './feedback/feedback.component';
export const routes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    {path: 'welcome',component: WelcomeComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'forget-password', component: ForgetPasswordComponent}, 
    { path: 'home', component: HomeComponent},    
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'chatbot', component: ChatbotComponent},   
    { path: 'besoin', component: BesoinComponent},    
    { path: 'register', component: RegisterComponent},  
    { path: 'sidebar', component: SidebarComponent},
    { path: 'my-header', component: MyHeaderComponent}, 
    { path: 'my-content', component: MyContentComponent},
    { path: 'mail', component: MailComponent},
    { path: 'affecter-mail', component: AffecterMailComponent},
    { path: 'debloquer-mail', component: DebloquerMailComponent},
    { path: 'liberer-mail', component: LibererMailComponent},
    { path: 'users', component: UserComponent },
    { path: 'client-assign/:id', component: ClientAssignComponent }, // 👈 route pour le profil
    { path: 'documentation' , component: DocumentationComponent } ,// Redirige vers la page d'accueil pour les routes non trouvées
    { path: 'navbar',component: NavbarComponent},
    { path: 'sidebar-client', component: SidebarClientComponent },
    { path: 'mail-client', component: MailClientComponent },
    { path: 'salaries', component: SalariesComponent },
    { path: 'add-salarie', component: AddSalarieComponent },
    { path: 'liste-salaries', component: ListeSalariesComponent },
    { path: 'edit-salarie/:id', component: EditSalarieComponent },
    { path: 'statistiques', component: StatistiquesComponent },
    { path: 'imports', component: ImportsExportsComponent },
    { path: 'tableau-bord', component: TableauBordComponent },
    { path: 'spst', component: SpstComponent },
    {path: 'feedback', component: FeedbackComponent},
];

