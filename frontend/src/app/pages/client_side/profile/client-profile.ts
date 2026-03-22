import { ClientBackground } from '../client-background';
import { Component, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Navbar } from '../../../components/navbar/navbar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-client-profile',
  imports: [RouterLink, ReactiveFormsModule, Navbar, ClientBackground],
  templateUrl: './client-profile.html',
  styleUrl: './client-profile.css'
})
export class ClientProfile {
  private readonly authService = inject(AuthService);
  private readonly fb          = inject(FormBuilder);

  readonly user      = this.authService.currentUser;
  readonly firstName = computed(() => this.user()?.fullName?.split(' ')[0] ?? 'Adventurer');

  // ── UI state ──
  isEditing       = signal(false);
  isSaving        = signal(false);
  saveSuccess     = signal(false);
  showPassForm    = signal(false);

  // ── Notification toggles ──
  emailNotif      = signal(true);
  questUpdates    = signal(true);
  milestoneAlerts = signal(false);

  // ── Toggle methods (arrow functions not allowed in Angular templates) ──
  toggleEmailNotif():      void { this.emailNotif.update(v => !v); }
  toggleQuestUpdates():    void { this.questUpdates.update(v => !v); }
  toggleMilestoneAlerts(): void { this.milestoneAlerts.update(v => !v); }
  toggleShowPassForm():    void { this.showPassForm.update(v => !v); }

  // ── Edit form ──
  editForm = this.fb.group({
    fullName:       [this.user()?.fullName       ?? '', Validators.required],
    email:          [this.user()?.email          ?? '', [Validators.required, Validators.email]],
    phoneNum:       [this.user()?.phoneNum        ?? ''],
    location:       [this.user()?.location        ?? ''],
    githubUsername: [this.user()?.githubUsername  ?? ''],
    company:        ['Tech Solutions'],
    specialization: ['Software Development'],
  });

  // ── Mock stats ──
  // 🔗 Replace with GET /api/users/me/stats when backend ready
  stats = { totalQuests: 12, activeQuests: 4, completedQuests: 8, activeParties: 3 };

  rating      = 4.8;
  ratingCount = 14;
  memberSince = 'January 2025';

  getStars(): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(this.rating) ? 'full' : (i < this.rating ? 'half' : 'empty')
    );
  }

  onEditToggle(): void {
    if (this.isEditing()) {
      this.editForm.patchValue({
        fullName:       this.user()?.fullName       ?? '',
        email:          this.user()?.email          ?? '',
        phoneNum:       this.user()?.phoneNum        ?? '',
        location:       this.user()?.location        ?? '',
        githubUsername: this.user()?.githubUsername  ?? '',
      });
    }
    this.isEditing.update(v => !v);
  }

  onSave(): void {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
    this.isSaving.set(true);
    // 🔗 PUT /api/users/me when backend ready
    setTimeout(() => {
      this.isSaving.set(false);
      this.saveSuccess.set(true);
      this.isEditing.set(false);
      setTimeout(() => this.saveSuccess.set(false), 3000);
    }, 800);
  }

  logout(): void { this.authService.logout(); }
}