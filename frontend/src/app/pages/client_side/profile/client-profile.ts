import { ClientBackground } from '../client-background';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { Navbar } from '../../../components/navbar/navbar';
import { AuthService } from '../../../core/services/auth.service';
import { QuestService } from '../../../core/services/quest.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar, ClientBackground],
  templateUrl: './client-profile.html',
  styleUrl: './client-profile.css'
})
export class ClientProfile implements OnInit {
  // Inject the new ProfileService alongside existing ones
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly questService = inject(QuestService);

  // --- Core Data from ProfileService ---
  readonly user = this.profileService.currentUser;
  
  // Grabs the first name from the full name string
  readonly firstName = computed(() => 
    this.user()?.fullName?.split(' ') ?? 'Adventurer'
  );
  
  readonly memberSince = computed(() => {
    const date = this.user()?.createdAt;
    return date ? new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';
  });

  clientQuests = computed(() => {
    const userId = this.user()?._id;
    return this.questService.quests().filter(q => 
      q.commissioner === userId || q.commissioner?._id === userId
    );
  });

  liveStats = computed(() => {
    const q = this.clientQuests();
    return {
      total: q.length,
      active: q.filter(x => x.status === 'open' || x.status === 'in_progress').length,
      completed: q.filter(x => x.status === 'completed').length,
      activeParties: [...new Set(q.map(x => x.party).filter(p => !!p))].length 
    };
  });


  ngOnInit(): void {
    // 1. Fetch fresh profile data to populate the signal
    this.profileService.fetchProfile().subscribe();
    
    // 2. Fetch quests to populate the hub/stats signals
    this.questService.getQuests().subscribe();
  }

  // We still use AuthService for session termination
  logout(): void {
    this.authService.logout();
  }
}