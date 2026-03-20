import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../components/navbar/navbar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-client-overview',
  imports: [RouterLink, CommonModule, Navbar],
  templateUrl: './client-overview.html',
  styleUrl: './client-overview.css'
})
export class ClientOverview {
  private readonly authService = inject(AuthService);

  readonly user      = this.authService.currentUser;
  readonly firstName = computed(() =>
    this.user()?.fullName?.split(' ')[0] ?? 'Adventurer'
  );

  // ─────────────────────────────────────────────────────────────────
  // 🔗 BACKEND INTEGRATION POINT
  //
  // Replace ALL mock data below with real API calls.
  //
  // Suggested endpoints:
  //   GET /api/quests/active        → activeQuest
  //   GET /api/quests/progress      → questProgress[]
  //   GET /api/milestones/current   → milestones[]
  //   GET /api/users/me/stats       → stats (questsDone, activeQuests)
  // ─────────────────────────────────────────────────────────────────

  activeQuest: any = {
    title:      'Web Portal for Local Cafe',
    client:     "Kyla's Coffee Co.",
    difficulty: 'easy',
    img:        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80',
    techStack:  ['Angular', 'Node.js', 'MongoDB'],
    xp:         250,
    deadline:   'May 15, 2025',
  };

  stats = {
    questsDone:   3,
    activeQuests: 2,
  };

  questProgress = [
    { id: 1, title: 'E-Commerce Website Development Tool', pct: 75, difficulty: 'hard',   deadline: 'May 10, 2025' },
    { id: 2, title: 'Financial Dashboard Backend',         pct: 40, difficulty: 'medium', deadline: 'May 19, 2025' },
    { id: 3, title: 'Social Media Analytics Tool',         pct: 10, difficulty: 'hard',   deadline: 'May 30, 2025' },
  ];

  milestones = [
    { id: 1, label: 'Project Planning',    done: true  },
    { id: 2, label: 'UI Design',           done: true  },
    { id: 3, label: 'Database Setup',      done: true  },
    { id: 4, label: 'Backend Integration', done: false },
    { id: 5, label: 'Testing & QA',        done: false },
    { id: 6, label: 'Deployment',          done: false },
  ];

  logout(): void {
    this.authService.logout();
  }
}