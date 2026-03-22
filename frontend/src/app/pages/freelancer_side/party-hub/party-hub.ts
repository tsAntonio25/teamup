import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../components/navbar/navbar';

export interface Party {
  name: string;
  description: string;
  image: string;
  current: number;
  max: number;
}

@Component({
  selector: 'app-party-hub',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './party-hub.html',
  styleUrl: './party-hub.css'
})
export class PartyHub {

  role: 'apprentice' | 'party-master' = 'party-master';
  searchTerm = '';

  parties: Party[] = [
    { name: 'Frontend Wizards',  description: 'Frontend focus freelancers for web projects.',      image: 'images/party-frontend.png', current: 2, max: 3 },
    { name: 'Backend Avengers',  description: 'Developers who keep the platform fast and secure.', image: 'images/party-backend.png',  current: 2, max: 3 },
    { name: 'SEO Crusaders',     description: "Experts who improve your site's search ranking.",   image: 'images/party-seo.png',      current: 2, max: 3 },
    { name: 'UI Heroes',         description: 'Designers of clean, user-friendly interfaces.',     image: 'images/party-ui.png',       current: 1, max: 3 },
    { name: 'Data Wizards',      description: 'Experts who keep data accurate and organized.',     image: 'images/party-data.png',     current: 1, max: 3 },
    { name: 'API Architects',    description: 'Developers who connect the platform via APIs.',     image: 'images/party-api.png',      current: 2, max: 3 },
  ];

  filteredParties: Party[] = [...this.parties];

  applyFilter(): void {
    this.filteredParties = this.parties.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  joinParty(party: Party): void { alert(`You have joined ${party.name}!`); }

  showCreateParty = false;
  newParty = { name: '', description: '', specialization: '', skills: '', max: 3 };

  createParty(): void {
    if (this.newParty.name && this.newParty.description) {
      this.parties.push({
        name: this.newParty.name,
        description: this.newParty.description,
        image: 'images/party-default.png',
        current: 1,
        max: this.newParty.max
      });
      this.filteredParties = [...this.parties];
      this.newParty = { name: '', description: '', specialization: '', skills: '', max: 3 };
      this.showCreateParty = false;
    }
  }
}