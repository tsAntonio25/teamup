import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../../components/admin-header/admin-header';
import { Footer } from '../../../components/footer/footer';
import { AdminBackground } from '../admin-background';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  imports: [AdminBackground, CommonModule, AdminSidebar, AdminHeader, Footer],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  stats = [
    { label: 'Total Users',       value: '1,250' },
    { label: 'Total Freelancers', value: '850'   },
    { label: 'Total Clients',     value: '400'   },
    { label: 'Total Quest',       value: '320'   },
  ];

  miniStats = [
    { label: 'Active Parties',    value: 58  },
    { label: 'Quest in Progress', value: 145 },
    { label: 'Completed Quest',   value: 250 },
  ];

  activities = [
    { initials: 'JD', user: 'JohnDoe',      activity: 'Joined "Web Design Quest"',            date: 'Today'      },
    { initials: 'JS', user: 'JaneSmith',     activity: 'Completed "E-Commerce App Task"',       date: '1 day ago'  },
    { initials: 'SB', user: 'SarahBrown',    activity: 'Created New Quest "SEO Optimization"',  date: '2 days ago' },
    { initials: 'DW', user: 'DavidWilliams', activity: 'Reached Milestone 3 on "CRM Project"',  date: '3 days ago' },
    { initials: 'JJ', user: 'JeffJohnson',   activity: 'Completed "Bug Fixes & Maintenance"',   date: '4 days ago' },
  ];

  ngOnInit(): void {
    this.initGrowthChart();
    this.initQuestChart();
  }

  initGrowthChart(): void {
    new Chart('growthChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          { label: 'Freelancers', data: [320,500,500,750,850], borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.08)', tension: 0.4, pointBackgroundColor: '#a855f7', pointRadius: 5, borderWidth: 2, fill: true },
          { label: 'Clients',     data: [150,280,370,560,680], borderColor: '#f472b6', backgroundColor: 'rgba(244,114,182,0.08)', tension: 0.4, pointBackgroundColor: '#f472b6', pointRadius: 5, borderWidth: 2, fill: true }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(168,85,247,0.08)' }, ticks: { color: 'rgba(200,160,255,0.6)', font: { size: 10, family: 'Orbitron' } }, border: { color: 'rgba(168,85,247,0.2)' } },
          y: { min: 0, max: 1000, grid: { color: 'rgba(168,85,247,0.08)' }, ticks: { color: 'rgba(200,160,255,0.6)', font: { size: 9, family: 'Orbitron' }, stepSize: 250 }, border: { display: false } }
        }
      }
    });
  }

  initQuestChart(): void {
    new Chart('questChart', {
      type: 'bar',
      data: {
        labels: ['M','T','W','T','F','S','S'],
        datasets: [
          { label: 'Active',    data: [45,60,50,65,20,42,65], backgroundColor: 'rgba(168,85,247,0.7)', borderRadius: 6, barPercentage: 0.6 },
          { label: 'Completed', data: [15,18,12,10,15,25,16], backgroundColor: 'rgba(244,114,182,0.7)', borderRadius: 6, barPercentage: 0.6 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: 'rgba(200,160,255,0.6)', font: { size: 10, family: 'Orbitron' } }, border: { display: false } },
          y: { stacked: true, min: 0, max: 100, grid: { color: 'rgba(168,85,247,0.08)' }, ticks: { color: 'rgba(200,160,255,0.6)', font: { size: 9, family: 'Orbitron' }, stepSize: 20 }, border: { display: false } }
        }
      }
    });
  }
}