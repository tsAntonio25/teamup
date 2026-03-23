import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../components/navbar/navbar';
import { FreelancerBackground } from '../freelancer-background';

@Component({
  selector: 'app-freelancer-profile',
  standalone: true,
  imports: [CommonModule, Navbar, FreelancerBackground],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class FreelancerProfile {
  role: 'apprentice' | 'party-master' = 'party-master';

  get exp(): string    { return this.role === 'apprentice' ? '950'   : '2,100'; }
  get level(): string  { return this.role === 'apprentice' ? 'Lv 5'  : 'Lv 12'; }
  get experience(): string { return this.role === 'apprentice' ? 'Junior Developer' : 'Intermediate Developer'; }
}