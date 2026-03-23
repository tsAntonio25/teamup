import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../components/navbar/navbar';
import { FreelancerBackground } from '../freelancer-background';

export interface Quest {
  name: string; client: string; budget: string; budgetNum: number;
  difficulty: 'Easy' | 'Medium' | 'Hard'; skills: string; deadline: string; image: string;
}

@Component({
  selector: 'app-freelancer-quests',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, FreelancerBackground],
  templateUrl: './quests.html',
  styleUrl: './quests.css'
})
export class FreelancerQuests {

  searchTerm = ''; selectedSkill = ''; selectedReward = ''; selectedDifficulty = '';

  quests: Quest[] = [
    { name: 'Restaurant Website Redesign',    client: 'Maria Santos',      budget: '₱12,000', budgetNum: 12000, difficulty: 'Medium', skills: 'Figma, HTML, CSS',                         deadline: 'May 25, 2026',  image: 'images/quest-restaurant.png'  },
    { name: 'Angular Dashboard Development',   client: 'David Lee',         budget: '₱18,000', budgetNum: 18000, difficulty: 'Hard',   skills: 'Angular, TypeScript, HTML, CSS, REST API', deadline: 'June 05, 2026', image: 'images/quest-angular.png'     },
    { name: 'Landing Page UI Improvement',    client: 'Carla Reyes',       budget: '₱7,000',  budgetNum: 7000,  difficulty: 'Easy',   skills: 'Figma, HTML, CSS, JavaScript',             deadline: 'May 22, 2026',  image: 'images/quest-landing.png'     },
    { name: 'Bug Fixing for Web Application', client: 'Kevin Tan',         budget: '₱6,000',  budgetNum: 6000,  difficulty: 'Easy',   skills: 'HTML, CSS, JavaScript, Git',               deadline: 'May 20, 2026',  image: 'images/quest-bug.png'         },
    { name: 'Mobile App Login System',        client: 'Maria Angela Cruz', budget: '₱10,000', budgetNum: 10000, difficulty: 'Medium', skills: 'Flutter, Dart, Firebase',                  deadline: 'June 01, 2026', image: 'images/quest-mobile.png'      },
    { name: 'Admin Dashboard UI Design',      client: 'Mark Villanueva',   budget: '₱9,000',  budgetNum: 9000,  difficulty: 'Medium', skills: 'Figma, HTML, CSS, JavaScript',             deadline: 'May 30, 2026',  image: 'images/quest-admin.png'       },
  ];

  recommendedQuests: Quest[] = [
    { name: 'Blog Website Setup',               client: 'Sophia Lim',    budget: '₱8,000',  budgetNum: 8000,  difficulty: 'Easy',   skills: 'WordPress, HTML, CSS',                     deadline: 'May 24, 2026',  image: 'images/quest-blog.png'        },
    { name: 'Task Manager Web App',             client: 'Daniel Garcia', budget: '₱15,000', budgetNum: 15000, difficulty: 'Hard',   skills: 'Angular, Node.js, MongoDB, JavaScript',    deadline: 'June 10, 2026', image: 'images/quest-task.png'        },
    { name: 'Website Performance Optimization', client: 'Ethan Morales', budget: '₱11,000', budgetNum: 11000, difficulty: 'Medium', skills: 'JavaScript, Web Optimization, Lighthouse', deadline: 'May 28, 2026',  image: 'images/quest-performance.png' },
  ];

  filteredQuests: Quest[] = [...this.quests];

  applyFilter(): void {
    this.filteredQuests = this.quests.filter(q => {
      const matchesSearch     = q.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || q.client.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSkill      = !this.selectedSkill || q.skills.includes(this.selectedSkill);
      const matchesDifficulty = !this.selectedDifficulty || q.difficulty === this.selectedDifficulty;
      const matchesReward     = !this.selectedReward ||
        (this.selectedReward === 'low'  && q.budgetNum < 8000) ||
        (this.selectedReward === 'mid'  && q.budgetNum >= 8000 && q.budgetNum <= 12000) ||
        (this.selectedReward === 'high' && q.budgetNum > 12000);
      return matchesSearch && matchesSkill && matchesDifficulty && matchesReward;
    });
  }
}