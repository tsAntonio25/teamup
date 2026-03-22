import { AdminBackground } from '../admin-background';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../../components/admin-header/admin-header';
import { Footer } from '../../../components/footer/footer';
import { UsersFilter } from './users-filter/users-filter';
import { UsersTable } from './users-table/users-table';

export interface User {
  name: string;
  avatar: string;
  role: 'Freelancer' | 'Client';
  email: string;
  level?: number;
  rank?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  status: 'Active' | 'Suspended';
}

@Component({
  selector: 'app-admin-users',
  imports: [AdminBackground, CommonModule, AdminSidebar, AdminHeader, Footer, UsersFilter, UsersTable],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers {

  stats = [
    { icon: '👥', label: 'Total Users',       value: '1,250' },
    { icon: '🧑‍💻', label: 'Total Freelancers', value: '850'   },
    { icon: '📋', label: 'Total Quest',        value: '320'   },
  ];

  users: User[] = [
    { name: 'John Doe',       avatar: 'JD', role: 'Freelancer', email: 'john@email.com',    level: 5,  rank: 'Bronze',   status: 'Active'    },
    { name: 'Jane Smith',     avatar: 'JS', role: 'Client',     email: 'jane@email.com',                                  status: 'Suspended' },
    { name: 'Sarah Brown',    avatar: 'SB', role: 'Freelancer', email: 'sarah@email.com',   level: 8,  rank: 'Silver',   status: 'Active'    },
    { name: 'David Williams', avatar: 'DW', role: 'Freelancer', email: 'david@email.com',   level: 12, rank: 'Gold',     status: 'Active'    },
    { name: 'Jeff Johnson',   avatar: 'JJ', role: 'Freelancer', email: 'jeff@email.com',    level: 15, rank: 'Platinum', status: 'Active'    },
    { name: 'Alice Cooper',   avatar: 'AC', role: 'Freelancer', email: 'alice@email.com',   level: 7,  rank: 'Silver',   status: 'Suspended' },
    { name: 'Rachel Brewer',  avatar: 'RB', role: 'Client',     email: 'rachel@email.com',                                status: 'Active'    },
    { name: 'Michael Clarke', avatar: 'MC', role: 'Client',     email: 'michael@email.com',                               status: 'Active'    },
  ];

  filteredUsers: User[] = [...this.users];

  private searchTerm = '';
  private selectedRole = 'All Roles';

  onSearchChange(term: string): void {
    this.searchTerm = term;
  }

  onRoleChange(role: string): void {
    this.selectedRole = role;
  }

  applyFilter(): void {
    this.filteredUsers = this.users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        || u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.selectedRole === 'All Roles' || u.role === this.selectedRole;
      return matchesSearch && matchesRole;
    });
  }
}