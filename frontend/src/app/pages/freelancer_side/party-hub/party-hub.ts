import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../components/navbar/navbar';
import { FreelancerBackground } from '../freelancer-background';
import { PartyService } from '../../../core/services/party.service'; // Adjust path
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-party-hub',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, FreelancerBackground],
  templateUrl: './party-hub.html',
  styleUrl: './party-hub.css'
})
export class PartyHub implements OnInit {
  private partyService = inject(PartyService);
  private profileService = inject(ProfileService);

  // Use a Signal for the parties list to stay reactive
  parties = signal<any[]>([]);
  searchTerm = signal('');
  
  // User info for role-based actions (like checking if they can create a party)
  user = this.profileService.currentUser;

  // Computed signal: Automatically filters whenever 'parties' or 'searchTerm' changes
  filteredParties = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.parties().filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadParties();
  }

  loadParties(): void {
    this.partyService.getParties().subscribe({
      next: (data) => this.parties.set(data),
      error: (err) => console.error('Failed to load parties:', err)
    });
  }

  updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  joinParty(partyId: string): void {
    this.partyService.joinParty(partyId).subscribe({
      next: (res) => {
        alert(res.message);
        this.loadParties(); // Refresh list to show updated member counts
      },
      error: (err) => alert(err.error.message)
    });
  }

  // Create Party logic
  showCreateParty = false;
  newParty = { name: '', description: '', techStack: '' };

  createParty(): void {
    if (this.newParty.name && this.newParty.description) {
      // Convert skills string into an array for the backend
      const partyData = {
        ...this.newParty,
        techStack: this.newParty.techStack.split(',').map(s => s.trim())
      };

      this.partyService.createParty(partyData).subscribe({
        next: () => {
          this.loadParties(); // Refresh list
          this.showCreateParty = false;
          this.newParty = { name: '', description: '', techStack: '' };
        },
        error: (err) => alert(err.error.message)
      });
    }
  }
}