import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly authService = inject(AuthService);

  mobileOpen = false;

  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly userName   = computed(() => this.authService.currentUser()?.fullName?.split(' ')[0] ?? '');
  readonly roleLabel  = computed(() => {
    const labels: Record<string, string> = {
      apprentice:   'Apprentice',
      partyMaster:  'Party Master',
      commissioner: 'Commissioner',
      admin:        'Admin'
    };
    return labels[this.authService.userRole() ?? ''] ?? '';
  });

  logout(): void {
    this.authService.logout();
    this.mobileOpen = false;
  }
}