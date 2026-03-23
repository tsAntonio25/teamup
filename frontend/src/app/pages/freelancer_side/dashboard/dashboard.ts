import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../../components/navbar/navbar';
import { FreelancerBackground } from '../freelancer-background';

export interface DashboardTask {
  name: string;
  quest: string;
  progress: number;
  due: string;
}

@Component({
  selector: 'app-freelancer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar, FreelancerBackground],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class FreelancerDashboard {

  role: 'apprentice' | 'party-master' = 'party-master';
  userName = 'David';
  expMax = 5000;

  get exp(): number {
    return this.role === 'party-master' ? 2100 : 950;
  }

  get level(): number {
    return this.role === 'party-master' ? 12 : 5;
  }

  showLeaveModal = false;

  currentTasks: DashboardTask[] = [
    { name: 'Task 1 — Build Product Listing UI', quest: 'E-Commerce Website Development', progress: 40, due: 'April 25' },
    { name: 'Task 2 — Application of API',        quest: 'E-Commerce Website Development', progress: 65, due: 'April 22' },
    { name: 'Task 3 — Setup Payment Gateway',     quest: 'E-Commerce Website Development', progress: 5,  due: 'May 10'  },
  ];

  leaveParty(): void  { this.showLeaveModal = true; }

  confirmLeave(): void {
    this.showLeaveModal = false;
    this.currentTasks = [];
  }
}