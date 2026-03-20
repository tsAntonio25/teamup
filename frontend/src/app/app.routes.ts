import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

// ─────────────────────────────────────────────────────────────────
// 🔧 TEMP: commissionerGuard and partyMasterGuard removed for testing
// When backend is ready:
//   1. Add back: import { authGuard, guestGuard, commissionerGuard, partyMasterGuard }
//   2. Add back canActivate: [authGuard, commissionerGuard] on client routes
//   3. Add back canActivate: [authGuard, partyMasterGuard] on freelancer routes
// ─────────────────────────────────────────────────────────────────

export const routes: Routes = [

  // ── PUBLIC ──────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then(m => m.Landing)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },

  // ── PLACEHOLDER DASHBOARD ────────────────────────────────────────
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },

  // ── CLIENT (commissioner) — guard removed temporarily for testing ─
  {
    path: 'client',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/client_side/overview/client-overview').then(m => m.ClientOverview)
  },
  {
    path: 'client/profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/client_side/profile/client-profile').then(m => m.ClientProfile)
  },
  {
    path: 'client/quest-hub',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/client_side/quest-hub/client-quest-hub').then(m => m.ClientQuestHub)
  },
  {
    path: 'client/quest-board',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/client_side/quest-board/client-quest-board').then(m => m.ClientQuestBoard)
  },

  // ── FREELANCER — commented out until files are created ───────────
  // {
  //   path: 'freelancer',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./pages/freelancer_side/overview/freelancer-overview').then(m => m.FreelancerOverview)
  // },

  // ── ADMIN ────────────────────────────────────────────────────────
  // 🔧 TEMP: no adminGuard yet — add canActivate: [authGuard, adminGuard] when ready
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/dashboard/admin-dashboard').then(m => m.AdminDashboard)
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./pages/admin/users/admin-users').then(m => m.AdminUsers)
  },
  {
    path: 'admin/quest',
    loadComponent: () => import('./pages/admin/quest/admin-quest').then(m => m.AdminQuest)
  },
  {
    path: 'admin/chat-logs',
    loadComponent: () => import('./pages/admin/chat-logs/admin-chat-logs').then(m => m.AdminChatLogs)
  },

  // ── FALLBACK ─────────────────────────────────────────────────────
  { path: '**', redirectTo: '' }
];