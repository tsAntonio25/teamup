import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../admin-users';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-table.html',
  styleUrl: './users-table.css'
})
export class UsersTable {
  @Input() users: User[] = [];

  getInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('');
  }
}