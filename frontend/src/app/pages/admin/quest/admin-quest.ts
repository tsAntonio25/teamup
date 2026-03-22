import { AdminBackground } from '../admin-background';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../../components/admin-header/admin-header';
import { Footer } from '../../../components/footer/footer';
import { QuestFilter } from './quest-filter/quest-filter';
import { QuestTable } from './quest-table/quest-table';

export interface Quest {
  name: string;
  client: string;
  assignedParty: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  posted: string;
}

@Component({
  selector: 'app-admin-quest',
  imports: [AdminBackground, CommonModule, AdminSidebar, AdminHeader, Footer, QuestFilter, QuestTable],
  templateUrl: './admin-quest.html',
  styleUrl: './admin-quest.css'
})
export class AdminQuest {

  stats = [
    { icon: '📊', label: 'Active Quest',    value: 58  },
    { icon: '🔔', label: 'Total Quests',    value: 320 },
    { icon: '🏆', label: 'Completed Quest', value: 170 },
  ];

  quests: Quest[] = [
    { name: 'E-Commerce Website Development',            client: 'ABC Solutions', assignedParty: 'Party #12',         status: 'Pending',     posted: '1 day ago'   },
    { name: 'Mobile App Design',                         client: 'Acme Corp',     assignedParty: 'No Party Assigned',  status: 'In Progress', posted: '2 days ago'  },
    { name: 'SEO Optimization for Local Business',       client: 'StartupHub',    assignedParty: 'Party #7',          status: 'Completed',   posted: '4 days ago'  },
    { name: 'Social Media Platform Backend Development', client: 'Innovate Inc.', assignedParty: 'No Party Assigned',  status: 'Pending',     posted: '1 week ago'  },
    { name: 'Bug Fixes & Maintenance',                   client: 'ABC Solutions', assignedParty: 'Party #9',          status: 'In Progress', posted: '1 week ago'  },
    { name: 'CRM System Integration',                    client: 'Acme Corp',     assignedParty: 'Party #5',          status: 'Completed',   posted: '2 weeks ago' },
    { name: 'Website Redesign and Optimization',         client: 'StartupHub',    assignedParty: 'No Party Assigned',  status: 'Pending',     posted: '2 weeks ago' },
    { name: 'API Development for Payment Gateway',       client: 'Innovate Inc.', assignedParty: 'Party #11',         status: 'In Progress', posted: '3 weeks ago' },
  ];

  filteredQuests: Quest[] = [...this.quests];

  private searchTerm = '';
  private selectedStatus = 'All Status';

  onSearchChange(term: string): void {
    this.searchTerm = term;
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
  }

  applyFilter(): void {
    this.filteredQuests = this.quests.filter(q => {
      const matchesSearch = q.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        || q.client.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All Status' || q.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }
}