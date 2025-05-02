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
import { GestionnaireprofComponent } from './gestionnaireprof/gestionnaireprof.component';

import { NotifComponent } from './notif/notif.component';
import { UprofComponent } from './uprof/uprof.component';
import { EmployeComponent } from './employe/employe.component';
import { DashmangComponent } from './dashmang/dashmang.component';
import { FormComponent } from './form/form.component';
import { AccesComponent } from './acces/acces.component';
import { SpstComponent } from './spst/spst.component';
import { ImportsExportsComponent } from './imports-exports/imports-exports.component';
import { TableauBordComponent } from './tableau-bord/tableau-bord.component';
import { ListeSalariesComponent } from './salaries/liste-salaries/liste-salaries.component';
import { SalariesComponent } from './salaries/salaries.component';
import { SidebarClientComponent } from './sidebar-client/sidebar-client.component';
import { AddSalarieComponent } from './salaries/add-salarie/add-salarie.component';
import { StatistiquesComponent } from './statistiques/statistiques.component';
import { MailClientComponent } from './mail-client/mail-client.component';
import { PaymentComponent } from './payment/payment.component';



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
    { path: 'client-assign/:id', component: ClientAssignComponent }, 
    { path: 'documentation' , component: DocumentationComponent } ,// Redirige vers la page d'accueil pour les routes non trouvées
    { path: 'navbar',component: NavbarComponent},
    { path: 'gestionnaireprof' ,component: GestionnaireprofComponent},
    { path: 'employe' ,component: EmployeComponent},
    { path: 'notif', component: NotifComponent},
    { path: 'uprof', component: UprofComponent},
    { path: 'dashmang', component: DashmangComponent},
    { path: 'form', component: FormComponent},
    { path: 'acces', component: AccesComponent},
    { path: 'sidebar-client', component: SidebarClientComponent },
    { path: 'mail-client', component: MailClientComponent },
    { path: 'salaries', component: SalariesComponent },
    { path: 'add-salarie', component: AddSalarieComponent },
    { path: 'liste-salaries', component: ListeSalariesComponent },
    { path: 'statistiques', component: StatistiquesComponent },
    { path: 'imports', component: ImportsExportsComponent },
    { path: 'tableau-bord', component: TableauBordComponent },
    { path: 'spst', component: SpstComponent },
    { path: 'client-assign/:id', component: ClientAssignComponent }, // 👈 route pour le profil
    { path: 'documentation' , component: DocumentationComponent } ,// Redirige vers la page d'accueil pour les routes non trouvées
    { path: 'navbar',component: NavbarComponent},
    { path: 'payment',component: PaymentComponent},

];

