import { Component } from '@angular/core'; // Assurez-vous que Component est importé
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Assurez-vous que CommonModule est importé
import { NgbModal, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap'; // Importez NgbCollapseModule ici
import { LucideAngularModule, Calendar, Bell, User, Settings, LogOut, Lock, ChevronRight, Home, Users, BarChart, MessageCircle } from 'lucide-angular'; // Assurez-vous que tous les symboles sont importés
import { NgIconsModule } from '@ng-icons/core'; // Assurez-vous que NgIconsModule est importé
import { lucideCalendar, lucideBell, lucideUser, lucideSettings, lucideLogOut, lucideLock, lucideChevronRight, lucideChrome, lucideUsers, lucideArmchair, lucideMessageCircle } from '@ng-icons/lucide'; // Assurez-vous que tous les symboles sont importés
import { OnInit } from '@angular/core';


interface EmployeeInfo {
  name: string;
  role: string;
  companyId: string;
  avatar: string;
}

interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'approved';
}

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}
@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [
    BrowserModule,
    CommonModule, // CommonModule est généralement nécessaire pour les directives structurelles comme ngIf, ngFor, etc.
    NgbCollapseModule, // Ajoutez NgbCollapseModule ici
    LucideAngularModule, NgIconsModule
  ],
   templateUrl: './employe.component.html',
  styleUrl: './employe.component.css'
})
export class EmployeComponent implements OnInit {
  menuOpen = false;
    notificationsOpen = false;
    currentDate = new Date();
    isSidebarExpanded = false;
    isServiceMenuOpen = false;
    isCollapsed = true;
    weekDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
    monthNames = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];
  
    // Sample data
    employeeInfo: EmployeeInfo = {
      name: "John Smith",
      role: "Administrator",
      companyId: "EMP-2023-56",
      avatar: "/api/placeholder/100/100"
    };
    
    appointments: Appointment[] = [
      { id: 1, title: "Meeting with HR", date: "2025-04-26", time: "10:00 AM", status: "pending" },
      { id: 2, title: "Project Review", date: "2025-04-26", time: "2:00 PM", status: "approved" },
      { id: 3, title: "Client Call", date: "2025-04-27", time: "11:30 AM", status: "pending" },
      { id: 4, title: "Team Building", date: "2025-04-29", time: "3:00 PM", status: "approved" }
    ];
    
    notifications: Notification[] = [
      { id: 1, text: "New appointment request from HR", time: "10 min ago", read: false },
      { id: 2, text: "Your leave request was approved", time: "1 hour ago", read: false },
      { id: 3, text: "Reminder: Complete weekly report", time: "3 hours ago", read: true }
    ];
  
    constructor(private modalService: NgbModal) { }
    open(content: any) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }
  
    ngOnInit(): void {
    }
  
    toggleMenu(): void {
      this.menuOpen = !this.menuOpen;
    }
  
    toggleNotifications(): void {
      this.notificationsOpen = !this.notificationsOpen;
    }
  
    toggleSidebar(): void {
      this.isSidebarExpanded = !this.isSidebarExpanded;
    }
  
    toggleServiceMenu(): void {
      this.isServiceMenuOpen = !this.isServiceMenuOpen;
      this.isSidebarExpanded = true;
    }
  
    getMonthDays(): (number | null)[] {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();
      
      let days: (number | null)[] = [];
      // Add empty cells for days before the first day of month
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }
      
      // Add all days of the month
      for (let i = 1; i <= lastDate; i++) {
        days.push(i);
      }
      
      return days;
    }
  
    getDayClass(day: number | null): string {
      if (!day) return "invisible";
      
      // Check if the day has appointments
      const dayStr = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasAppointment = this.appointments.some(app => app.date === dayStr);
      
      // Today's date
      const today = new Date();
      const isToday = today.getDate() === day && 
                      today.getMonth() === this.currentDate.getMonth() && 
                      today.getFullYear() === this.currentDate.getFullYear();
      
      let className = "";
      
      if (isToday) {
        className += " bg-blue-500 text-white";
      } else if (hasAppointment) {
        className += " border-2 border-blue-400";
      }
      
      return className;
    }
  
    previousMonth(): void {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    }
  
    nextMonth(): void {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    }
  
    getUnreadNotificationsCount(): number {
      return this.notifications.filter(n => !n.read).length;
    }
  
    getPendingAppointmentsCount(): number {
      return this.appointments.filter(a => a.status === 'pending').length;
    }
  
    getApprovedAppointmentsCount(): number {
      return this.appointments.filter(a => a.status === 'approved').length;
    }
  }