import { ClientBackground } from '../client-background';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../components/navbar/navbar';

export interface Quest {
  name: string; tags: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  budget: string; deadline: string; deadlineSub: string;
  status: 'In Progress' | 'Completed' | 'Cancelled';
  party: string; partyMembers: string;
}

@Component({
  selector: 'app-client-quest-hub',
  imports: [CommonModule, FormsModule, Navbar, ClientBackground],
  templateUrl: './client-quest-hub.html',
  styleUrl: './client-quest-hub.css'
})
export class ClientQuestHub {

  activeTab  = 'all';
  searchTerm = '';

  stats = [
    { label: 'Total Quests', value: '12', icon: 'grid'   },
    { label: 'In Progress',  value: '4',  icon: 'clock'  },
    { label: 'Completed',    value: '8',  icon: 'check'  },
    { label: 'Cancelled',    value: '0',  icon: 'cancel' },
  ];

  quests: Quest[] = [
    { name: 'E-Commerce Website Development', tags: 'Angular, Node.js, MongoDB',  difficulty: 'Hard',   budget: '₱12,000', deadline: 'March 30, 2026', deadlineSub: '10 days left', status: 'In Progress', party: '#12', partyMembers: '3 members' },
    { name: 'Portfolio Website',              tags: 'HTML, CSS, JavaScript',       difficulty: 'Easy',   budget: '₱5,000',  deadline: 'March 10, 2026', deadlineSub: 'Completed',    status: 'Completed',   party: '#8',  partyMembers: '3 members' },
    { name: 'Mobile App UI Design',           tags: 'Figma, Adobe XD',             difficulty: 'Medium', budget: '₱7,500',  deadline: 'April 2, 2026',  deadlineSub: '13 days left', status: 'In Progress', party: '#15', partyMembers: '3 members' },
    { name: 'Backend API Development',        tags: 'Python, Django, PostgreSQL',  difficulty: 'Hard',   budget: '₱15,000', deadline: 'April 5, 2026',  deadlineSub: '16 days left', status: 'In Progress', party: '#4',  partyMembers: '3 members' },
    { name: 'Logo and Branding',              tags: 'Illustrator, Photoshop',      difficulty: 'Easy',   budget: '₱3,500',  deadline: 'March 07, 2026', deadlineSub: 'Completed',    status: 'Completed',   party: '#10', partyMembers: '3 members' },
  ];

  get filteredQuests(): Quest[] {
    return this.quests.filter(q => {
      const matchesTab =
        this.activeTab === 'all' ||
        (this.activeTab === 'progress'  && q.status === 'In Progress') ||
        (this.activeTab === 'completed' && q.status === 'Completed')   ||
        (this.activeTab === 'cancelled' && q.status === 'Cancelled');
      const matchesSearch = q.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }

  setTab(tab: string): void { this.activeTab = tab; }
}