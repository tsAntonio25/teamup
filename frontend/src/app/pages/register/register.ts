import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

function passwordMatchValidator(g: AbstractControl) {
  return g.get('password')?.value === g.get('confirmPassword')?.value
    ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly fb          = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);

  showPass    = signal(false);
  showConfirm = signal(false);
  isLoading   = signal(false);
  apiError    = signal('');
  termsError  = signal(false);
  step        = signal(1);
  primarySkills = signal<string[]>([]);
  techStack     = signal<string[]>([]);

  form = this.fb.group({
    fullName:        ['', [Validators.required, Validators.minLength(2)]],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['',  Validators.required],
    githubUsername:  [''],
    phoneNum:        [''],
    location:        [''],
    agreeTerms:      [false]
  }, { validators: passwordMatchValidator });

  readonly strengthPct = computed(() => {
    const p: string = this.form.get('password')?.value ?? '';
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)           s += 30;
    if (p.length >= 12)          s += 10;
    if (/[A-Z]/.test(p))         s += 20;
    if (/[0-9]/.test(p))         s += 20;
    if (/[^A-Za-z0-9]/.test(p))  s += 20;
    return Math.min(s, 100);
  });

  readonly strengthClass = computed(() => {
    const p = this.strengthPct();
    if (p <= 40) return 'weak';
    if (p <= 69) return 'fair';
    return 'strong';
  });

  readonly strengthLabel = computed(() => {
    const p = this.strengthPct();
    if (p <= 40) return 'Weak';
    if (p <= 69) return 'Fair';
    return 'Strong';
  });

  readonly step1Valid = computed(() =>
    ['fullName','email','password','confirmPassword'].every(f => this.form.get(f)?.valid) &&
    !this.form.errors?.['passwordMismatch']
  );

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c?.errors) return '';
    if (c.errors['required'])  return 'This field is required.';
    if (c.errors['email'])     return 'Please enter a valid email.';
    if (c.errors['minlength']) return `Must be at least ${c.errors['minlength'].requiredLength} characters.`;
    return 'Invalid input.';
  }

  nextStep(): void {
    if (!this.step1Valid()) {
      ['fullName','email','password','confirmPassword'].forEach(f => this.form.get(f)?.markAsTouched());
      return;
    }
    this.step.set(2);
  }

  onSkillKey(e: KeyboardEvent): void {
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const el = e.target as HTMLInputElement;
    const v  = el.value.replace(',','').trim();
    if (v && !this.primarySkills().includes(v)) this.primarySkills.update(a => [...a, v]);
    el.value = '';
  }

  onTechKey(e: KeyboardEvent): void {
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const el = e.target as HTMLInputElement;
    const v  = el.value.replace(',','').trim();
    if (v && !this.techStack().includes(v)) this.techStack.update(a => [...a, v]);
    el.value = '';
  }

  removeSkill(s: string): void { this.primarySkills.update(a => a.filter(x => x !== s)); }
  removeTech(t: string):  void { this.techStack.update(a => a.filter(x => x !== t)); }

  onSubmit(): void {
    if (!this.form.get('agreeTerms')?.value) { this.termsError.set(true); return; }
    this.termsError.set(false);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.apiError.set('');
    const { fullName, email, password, githubUsername, phoneNum, location } = this.form.value;
    // POST /api/auth/register → authController.register()
    // NOTE: role is NOT sent — backend always sets "apprentice"
    const payload = {
      fullName: fullName!, email: email!, password: password!,
      ...(githubUsername && { githubUsername }),
      ...(phoneNum       && { phoneNum }),
      ...(location       && { location }),
      professionalInfo: { primarySkills: this.primarySkills(), techStack: this.techStack() }
    };
    this.authService.register(payload).subscribe({
      next: () => { this.isLoading.set(false); this.router.navigate(['/dashboard']); },
      error: (err) => { this.isLoading.set(false); this.apiError.set(err.message ?? 'Registration failed.'); }
    });
  }
}