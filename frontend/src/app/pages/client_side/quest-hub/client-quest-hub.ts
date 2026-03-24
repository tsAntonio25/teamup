import { ClientBackground } from '../client-background';
import { Component, inject, OnInit, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms'; // Updated imports
import { Navbar } from '../../../components/navbar/navbar';
import { QuestService, Quest } from '../../../core/services/quest.service';
import { PartyService } from '../../../core/services/party.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service'; // Adjust path as needed

@Component({
  selector: 'app-client-quest-hub',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Navbar, ClientBackground],
  templateUrl: './client-quest-hub.html',
  styleUrl: './client-quest-hub.css'
})
export class ClientQuestHub implements OnInit {
  private questService = inject(QuestService);
  private partyService = inject(PartyService);
  private authService = inject(AuthService); 
  private fb = inject(FormBuilder);

  hasActiveQuest = computed(() => {
  return this.allQuests().some(q => q.status === 'open' || q.status === 'in_progress');
});


  allQuests = this.questService.quests;
  partyNames = signal<Record<string, string>>({});

  activeTab = signal('all');
  searchTerm = signal('');
  showCreateModal = signal(false); 
  questForm: FormGroup;
  isEditMode = signal(false);
  selectedQuest = signal<Quest | null>(null);

  constructor() {
      this.questForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required]],
        techStack: ['', [Validators.required]],
        deadline: ['', [Validators.required]],
        // Match the backend's expected flat keys
        githubRepoOwner: ['', [Validators.required]],
        githubRepoName: ['', [Validators.required]]
      });

    effect(() => {
      const quests = this.allQuests();
      const uniquePartyIds = [...new Set(quests.map(q => q.party).filter(id => !!id))] as string[];
      const currentMap = this.partyNames();

      const missingIds = uniquePartyIds.filter(id => !currentMap[id]);

      if (missingIds.length > 0) {
        const requests = missingIds.map(id => 
          this.partyService.getPartyById(id).pipe(
            catchError(() => of({ _id: id, name: 'Unknown Party' }))
          )
        );

        forkJoin(requests).subscribe(parties => {
          this.partyNames.update(map => {
            const newMap = { ...map };
            parties.forEach(p => {
              if (p) newMap[p._id] = p.name;
            });
            return newMap;
          });
        });
      }
    });
  }

  ngOnInit(): void {
    this.questService.getQuests().subscribe();
  }

  openCreateModal() {
    if (this.hasActiveQuest()) {
      alert("System Lock: You have an active objective. Complete it before deploying a new one.");
      return;
    }
    
    this.isEditMode.set(false);
    this.selectedQuest.set(null);
    this.questForm.enable();
    this.questForm.reset();
    this.showCreateModal.set(true);
  }

  openViewModal(quest: Quest) {
    this.isEditMode.set(false);
    this.selectedQuest.set(quest);
    this.questForm.patchValue({
      title: quest.title,
      description: quest.description,
      techStack: quest.techStack.join(', '),
      deadline: quest.deadline ? new Date(quest.deadline).toISOString().split('T') : '',
      githubRepoOwner: quest.githubRepo.owner,
      githubRepoName: quest.githubRepo.name
    });
    this.questForm.disable(); 
    this.showCreateModal.set(true);
  }

  openEditModal(quest: Quest) {
    this.isEditMode.set(true);
    this.selectedQuest.set(quest);
    this.questForm.enable(); 
    this.questForm.patchValue({
      title: quest.title,
      description: quest.description,
      techStack: quest.techStack.join(', '),
      deadline: quest.deadline ? new Date(quest.deadline).toISOString().split('T') : '',
      githubRepoOwner: quest.githubRepo.owner,
      githubRepoName: quest.githubRepo.name
    });
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.isEditMode.set(false);
    this.selectedQuest.set(null);
    this.questForm.enable(); 
    this.questForm.reset();
  }

  submitQuest() {
    if (this.questForm.valid) {
      const val = this.questForm.value;
      const payload = {
        title: val.title,
        description: val.description,
        techStack: val.techStack.split(',').map((s: string) => s.trim()),
        deadline: val.deadline,
        githubRepoOwner: val.githubRepoOwner,
        githubRepoName: val.githubRepoName
      };

      if (this.isEditMode() && this.selectedQuest()) {
        this.questService.updateQuest(this.selectedQuest()!._id, payload).subscribe({
          next: () => this.closeCreateModal(),
          error: (err) => alert("Update failed: " + err.error.message)
        });
      } else {
        this.questService.createQuest({ ...payload, status: 'open' }).subscribe({
          next: () => this.closeCreateModal(),
          error: (err) => alert("Deployment failed: " + err.error.message)
        });
      }
    }
  }

  stats = computed(() => {
    const q = this.allQuests();
    return [
      { label: 'Total Quests', value: q.length.toString(), icon: 'grid' },
      { label: 'In Progress',  value: q.filter(x => x.status === 'in_progress').length.toString(), icon: 'clock' },
      { label: 'Completed',    value: q.filter(x => x.status === 'completed').length.toString(), icon: 'check' },
      { label: 'Open',         value: q.filter(x => x.status === 'open').length.toString(), icon: 'unlock' },
    ];
  });

  filteredQuests = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const tab = this.activeTab();
    
    return this.allQuests().filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(term) || 
                            q.description.toLowerCase().includes(term);
      
      const matchesTab = 
        tab === 'all' || 
        (tab === 'progress' && q.status === 'in_progress') ||
        (tab === 'completed' && q.status === 'completed') ||
        (tab === 'open' && q.status === 'open');

      return matchesSearch && matchesTab;
    });
  });

  setTab(tab: string): void {
    this.activeTab.set(tab);
  }
}