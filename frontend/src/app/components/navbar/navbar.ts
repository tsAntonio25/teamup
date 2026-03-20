import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);

  // ── Use AuthService signals directly — no getCurrentUser() needed ──
  readonly user      = this.authService.currentUser;
  readonly userRole  = this.authService.userRole;

  readonly navLinks = computed(() => {
    const role = this.userRole();
    if (role === 'commissioner') {
      return [
        { label: 'Dashboard',   path: '/client'             },
        { label: 'Profile',     path: '/client/profile'     },
        { label: 'Quest Hub',   path: '/client/quest-hub'   },
        { label: 'Quest Board', path: '/client/quest-board' },
      ];
    }
    if (role === 'partyMaster') {
      return [
        { label: 'Dashboard',   path: '/freelancer'             },
        { label: 'Profile',     path: '/freelancer/profile'     },
        { label: 'Quest Hub',   path: '/freelancer/quest-hub'   },
        { label: 'Quest Board', path: '/freelancer/quest-board' },
      ];
    }
    if (role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin'        },
        { label: 'Users',     path: '/admin/users'  },
        { label: 'Quests',    path: '/admin/quests' },
      ];
    }
    return [{ label: 'Dashboard', path: '/dashboard' }];
  });

  logout(): void {
    // AuthService.logout() already clears storage + navigates to /login
    this.authService.logout();
  }
}