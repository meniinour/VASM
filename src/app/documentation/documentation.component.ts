import { Component, HostListener, OnInit,ElementRef  } from '@angular/core';
import { MyHeaderComponent } from "../my-header/my-header.component";
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from "../chatbot/chatbot.component";
interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    rtlTitle: "لوحة القيادة",
    icon: "icon-chart-pie-36",
    class: ""
  },
  {
    path: "/icons",
    title: "Icons",
    rtlTitle: "الرموز",
    icon: "icon-atom",
    class: ""
  },
  {
    path: "/maps",
    title: "Maps",
    rtlTitle: "خرائط",
    icon: "icon-pin",
    class: ""
  },
  {
    path: "/notifications",
    title: "Notifications",
    rtlTitle: "إخطارات",
    icon: "icon-bell-55",
    class: ""
  },
  {
    path: "/user",
    title: "User Profile",
    rtlTitle: "ملف تعريفي للمستخدم",
    icon: "icon-single-02",
    class: ""
  },
  {
    path: "/tables",
    title: "Table List",
    rtlTitle: "قائمة الجدول",
    icon: "icon-puzzle-10",
    class: ""
  },
  {
    path: "/typography",
    title: "Typography",
    rtlTitle: "طباعة",
    icon: "icon-align-center",
    class: ""
  },
  {
    path: "/rtl",
    title: "RTL Support",
    rtlTitle: "ار تي ال",
    icon: "icon-world",
    class: ""
  }
];

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css'],
  imports: [CommonModule, MyHeaderComponent, ChatbotComponent]
})
export class DocumentationComponent implements OnInit {

  // Définir la sidebar comme étendue au démarrage
  isSidebarExpanded = false;
  isServiceMenuOpen = false;
  isSidebarOpen = false;
  showChatbot = false;
  ngOnInit(): void {
    // Logique d'initialisation si nécessaire
  }
  
  constructor(private eRef: ElementRef) {}


  /*@HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isSidebarExpanded = false;
      this.isServiceMenuOpen = false;
    }
  }*/
  toggleServiceMenu() {
    this.isServiceMenuOpen = !this.isServiceMenuOpen;
    this.isSidebarExpanded = true;
  }

  navigateAndExpand() {
    this.isSidebarExpanded = true;
    this.isServiceMenuOpen = false;
  }

    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
    }
    isMobileMenu(): boolean {
        return window.innerWidth <= 991;
      }
    openChatbot() {
        this.showChatbot = true;
      }

      closeChatbot() {
        this.showChatbot = false;
      }

      closeSidebar() {
        this.isSidebarOpen = false;
        this.isServiceMenuOpen = false;
      }  

    }

