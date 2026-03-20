import { Component, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

function passwordMatchValidator(g: AbstractControl) {
  return g.get('password')?.value === g.get('confirmPassword')?.value
    ? null : { passwordMismatch: true };
}

// ── Enums ────────────────────────────────────────────────────────────────────

export const PRIMARY_SKILLS = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Backend Development',
  'Frontend Development',
  'Full Stack Development',
  'Game Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Cybersecurity',
  'Cloud Computing',
  'QA / Testing',
  'Technical Writing',
] as const;

export const TECH_GROUPS = [
  {
    label: 'Frontend',
    items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue', 'Next.js'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Express.js', 'Django', 'Flask', 'Laravel', 'Spring Boot'],
  },
  {
    label: 'Databases',
    items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase'],
  },
  {
    label: 'DevOps / Tools',
    items: ['Docker', 'Kubernetes', 'Git', 'GitHub Actions'],
  },
  {
    label: 'Cloud',
    items: ['AWS', 'Azure', 'Google Cloud'],
  },
  {
    label: 'Mobile',
    items: ['Flutter', 'React Native', 'Swift', 'Kotlin'],
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

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

  // ── UI state ──
  showPass    = signal(false);
  showConfirm = signal(false);
  isLoading   = signal(false);
  apiError    = signal('');
  termsError  = signal(false);
  step        = signal(1);

  // ── Tag/dropdown state ──
  primarySkills = signal<string[]>([]);
  techStack     = signal<string[]>([]);

  skillDropOpen = signal(false);
  techDropOpen  = signal(false);
  skillSearch   = signal('');

  // ── Expose enum data to template ──
  readonly skillOptions = PRIMARY_SKILLS;
  readonly techGroups   = TECH_GROUPS;

  // ── Form ──
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

  // ── Reactive form value signals ──
  // toSignal bridges RxJS FormControl observables into Angular signals
  // so that computed() re-runs on every keystroke
  private readonly passwordValue    = toSignal(this.form.get('password')!.valueChanges,        { initialValue: '' });
  private readonly confirmValue     = toSignal(this.form.get('confirmPassword')!.valueChanges, { initialValue: '' });
  private readonly fullNameValue    = toSignal(this.form.get('fullName')!.valueChanges,        { initialValue: '' });
  private readonly emailValue       = toSignal(this.form.get('email')!.valueChanges,           { initialValue: '' });

  // ── Password requirements ──
  readonly pwReqs = computed(() => {
    const p: string = this.passwordValue() ?? '';
    return {
      minLength:  p.length >= 8,
      hasUpper:   /[A-Z]/.test(p),
      hasLower:   /[a-z]/.test(p),
      hasNumber:  /[0-9]/.test(p),
      hasSpecial: /[^A-Za-z0-9]/.test(p),
    };
  });

  readonly allReqsMet = computed(() => Object.values(this.pwReqs()).every(Boolean));

  readonly step1Valid = computed(() => {
    // Touch the reactive signals so this computed re-runs on any field change
    const fullName = this.fullNameValue() ?? '';
    const email    = this.emailValue() ?? '';
    const pass     = this.passwordValue() ?? '';
    const confirm  = this.confirmValue() ?? '';

    const fullNameOk  = fullName.trim().length >= 2;
    const emailOk     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passOk      = this.allReqsMet();
    const confirmOk   = pass === confirm && confirm.length > 0;

    return fullNameOk && emailOk && passOk && confirmOk;
  });

  // ── Filtered skills for search ──
  readonly filteredSkills = computed(() => {
    const q = this.skillSearch().toLowerCase();
    return q
      ? PRIMARY_SKILLS.filter(s => s.toLowerCase().includes(q))
      : [...PRIMARY_SKILLS];
  });

  // ── Validation helpers ──
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

  // ── Step navigation ──
  nextStep(): void {
    if (!this.step1Valid()) {
      ['fullName','email','password','confirmPassword'].forEach(f => this.form.get(f)?.markAsTouched());
      return;
    }
    this.step.set(2);
  }

  // ── Primary Skills dropdown ──
  toggleSkill(skill: string): void {
    this.primarySkills.update(arr =>
      arr.includes(skill) ? arr.filter(s => s !== skill) : [...arr, skill]
    );
  }

  removeSkill(s: string): void {
    this.primarySkills.update(arr => arr.filter(x => x !== s));
  }

  onSkillBlur(): void {
    // Small delay so mousedown on option fires before blur closes dropdown
    setTimeout(() => this.skillDropOpen.set(false), 150);
  }

  // ── Tech Stack dropdown ──
  toggleTech(tech: string): void {
    this.techStack.update(arr =>
      arr.includes(tech) ? arr.filter(t => t !== tech) : [...arr, tech]
    );
  }

  removeTech(t: string): void {
    this.techStack.update(arr => arr.filter(x => x !== t));
  }

  onTechBlur(): void {
    setTimeout(() => this.techDropOpen.set(false), 150);
  }

  // ── Submit ──
  onSubmit(): void {
    if (!this.form.get('agreeTerms')?.value) { this.termsError.set(true); return; }
    this.termsError.set(false);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isLoading.set(true);
    this.apiError.set('');

    const { fullName, email, password, githubUsername, phoneNum, location } = this.form.value;

    // ─────────────────────────────────────────────────────────────────────────
    // 🔗 BACKEND INTEGRATION POINT — Register
    //
    // This calls AuthService.register() which should POST to your API endpoint.
    //
    // Expected endpoint : POST /api/auth/register
    // Controller        : authController.register()
    //
    // Payload shape sent to backend:
    // {
    //   fullName       : string           (required)
    //   email          : string           (required)
    //   password       : string           (required, already validated client-side)
    //   githubUsername : string           (optional — triggers role check on login)
    //   phoneNum       : string           (optional)
    //   location       : string           (optional)
    //   professionalInfo: {
    //     primarySkills : string[]        (enum values, see PRIMARY_SKILLS above)
    //     techStack     : string[]        (enum values, see TECH_GROUPS above)
    //   }
    // }
    //
    // NOTE: Do NOT send a "role" field — backend always defaults to "apprentice".
    //       If githubUsername has 3000+ commits, backend auto-promotes to "Party Master".
    //
    // Expected success response : { token: string, user: UserObject }
    //   → navigates to /dashboard
    //
    // Expected error response   : { message: string }
    //   → displays message in the error banner at the top of the form
    //
    // To connect: make sure AuthService.register() points to the correct base URL.
    // Check/set the API base URL in:
    //   src/app/core/services/auth.service.ts  → look for HttpClient.post(...)
    //   src/environments/environment.ts        → set apiUrl to your backend URL
    //   proxy.conf.json                        → if using Angular dev proxy for /api
    // ─────────────────────────────────────────────────────────────────────────
    const payload = {
      fullName: fullName!, email: email!, password: password!,
      ...(githubUsername && { githubUsername }),
      ...(phoneNum       && { phoneNum }),
      ...(location       && { location }),
      professionalInfo: {
        primarySkills: this.primarySkills(),
        techStack:     this.techStack(),
      }
    };

    this.authService.register(payload).subscribe({
      next:  () => { this.isLoading.set(false); this.router.navigate(['/dashboard']); },
      error: (err) => {
        this.isLoading.set(false);
        this.apiError.set(err.message ?? 'Registration failed.');
      }
    });
  }
}