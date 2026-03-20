import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly fb          = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);

  showPass  = signal(false);
  isLoading = signal(false);
  apiError  = signal('');

  form = this.fb.group({
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c?.errors) return '';
    if (c.errors['required'])  return `${field === 'email' ? 'Email' : 'Password'} is required.`;
    if (c.errors['email'])     return 'Please enter a valid email address.';
    if (c.errors['minlength']) return 'Password must be at least 6 characters.';
    return 'Invalid input.';
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isLoading.set(true);
    this.apiError.set('');

    const { email, password } = this.form.value;

    // ─────────────────────────────────────────────────────────────────────────
    // 🔗 BACKEND INTEGRATION POINT — Login
    //
    // This calls AuthService.login() which should POST to your API endpoint.
    //
    // Expected endpoint : POST /api/auth/login
    // Controller        : authController.login()
    //
    // Payload shape sent to backend:
    // {
    //   email    : string   (required)
    //   password : string   (required)
    // }
    //
    // Expected success response : { token: string, user: UserObject }
    //   → token should be saved (localStorage / cookie) inside AuthService
    //   → navigates to /dashboard on success
    //
    // Expected error response   : { message: string }
    //   e.g. "Invalid email or password"
    //   → displays message in the error banner at the top of the form
    //
    // "Remember Me" checkbox value is available as:
    //   this.form.value.rememberMe  (boolean)
    //   → pass to AuthService if your backend supports persistent sessions,
    //     or use it to decide between localStorage vs sessionStorage for the token
    //
    // To connect: make sure AuthService.login() points to the correct base URL.
    // Check/set the API base URL in:
    //   src/app/core/services/auth.service.ts  → look for HttpClient.post(...)
    //   src/environments/environment.ts        → set apiUrl to your backend URL
    //   proxy.conf.json                        → if using Angular dev proxy for /api
    // ─────────────────────────────────────────────────────────────────────────

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        // Backend returns: { message: "Invalid email or password" }
        this.apiError.set(err.message ?? 'Login failed. Please try again.');
      }
    });
  }
}