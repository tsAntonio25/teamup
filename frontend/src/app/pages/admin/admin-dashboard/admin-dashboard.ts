import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../../components/admin-header/admin-header';
import { Footer } from '../../../components/footer/footer';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSidebar, AdminHeader, Footer],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  stats = [
    { icon: '👥', label: 'Total Users',       value: '1,250' },
    { icon: '🧑‍💻', label: 'Total Freelancers', value: '850'   },
    { icon: '💼', label: 'Total Clients',      value: '400'   },
    { icon: '📋', label: 'Total Quest',        value: '320'   },
  ];

  miniStats = [
    { icon: '🎯', label: 'Active Parties',    value: 58  },
    { icon: '⚙️', label: 'Quest in Progress', value: 145 },
    { icon: '🏆', label: 'Completed Quest',   value: 250 },
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
          {
            label: 'Freelancers',
            data: [320, 500, 500, 750, 850],
            borderColor: '#5B4FCF',
            backgroundColor: 'transparent',
            tension: 0,
            pointBackgroundColor: '#5B4FCF',
            pointRadius: 6,
            borderWidth: 3
          },
          {
            label: 'Clients',
            data: [150, 280, 370, 560, 680],
            borderColor: '#E8457A',
            backgroundColor: 'transparent',
            tension: 0,
            pointBackgroundColor: '#E8457A',
            pointRadius: 6,
            borderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: 'white', font: { size: 12, family: 'Orbitron' } },
            border: { color: 'rgba(255,255,255,0.3)' }
          },
          y: {
            min: 0, max: 1000,
            grid: {
              color: 'white',
              lineWidth: 0.5
            },
            ticks: { color: 'white', font: { size: 11, family: 'Orbitron' }, stepSize: 250 },
            border: { display: false }
          }
        }
      }
    });
  }

  initQuestChart(): void {
    new Chart('questChart', {
      type: 'bar',
      data: {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        datasets: [
          {
            label: 'Active',
            data: [45, 60, 50, 65, 20, 42, 65],
            backgroundColor: 'white',
            borderRadius: 4,
            barPercentage: 0.6
          },
          {
            label: 'Completed',
            data: [15, 18, 12, 10, 15, 25, 16],
            backgroundColor: '#5A2E9E',
            borderRadius: 4,
            barPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: { color: 'white', font: { size: 12, family: 'Orbitron' } },
            border: { display: false }
          },
          y: {
            stacked: true,
            min: 0, max: 100,
            grid: {
              color: 'white',
              lineWidth: 0.5
            },
            ticks: { color: 'white', font: { size: 11, family: 'Orbitron' }, stepSize: 20 },
            border: { display: false }
          }
        }
      }
    });
  }
}