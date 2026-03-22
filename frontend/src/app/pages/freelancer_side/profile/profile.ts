import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../components/navbar/navbar';

@Component({
  selector: 'app-freelancer-profile',
  imports: [CommonModule, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class FreelancerProfile {
  role: 'apprentice' | 'party-master' = 'party-master';

  get exp(): string { return this.role === 'apprentice' ? '950' : '2,100'; }
  get level(): string { return this.role === 'apprentice' ? 'Level 5' : 'Level 12'; }
  get experience(): string { return this.role === 'apprentice' ? 'Junior Developer' : 'Intermediate Developer'; }
}