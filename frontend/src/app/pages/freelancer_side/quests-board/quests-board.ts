import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../components/navbar/navbar';
import { FreelancerBackground } from '../freelancer-background';
import { TaskService, Task } from '../../../core/services/task.service';
import { ProfileService } from '../../../core/services/profile.service';
import { PartyService } from '../../../core/services/party.service';
import { QuestService, Quest } from '../../../core/services/quest.service';

export interface Member {
  name: string;
  initials: string;
  role: string;
}

@Component({
  selector: 'app-quests-board',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, FreelancerBackground],
  templateUrl: './quests-board.html',
  styleUrl: './quests-board.css'
})
export class QuestsBoard {
  private taskService = inject(TaskService);
  private profileService = inject(ProfileService);
  private partyService = inject(PartyService);
  private questService = inject(QuestService);

  // --- UI State ---
  activeTab = 'tasks';
  showAddTask = false;
  editingTaskId: string | null = null;
  newTaskData = { name: '', description: '' };

  // --- Data Signals ---
  
  // 1. Current User (for getting the Party ID)
  user = this.profileService.currentUser;

  // 2. Populated Party Data (from PartyService)
  partyData = this.partyService.currentParty;

  currentQuest = signal<Quest | null>(null);
  
  // 3. Tasks (from TaskService)
  tasks = this.taskService.currentQuestTasks;

  // 4. Dynamic Member List (Now uses partyData() signal)
  members = computed<Member[]>(() => {
    const party = this.partyData();
    if (!party) return [];

    const list: Member[] = [];

    if (party.partyMaster) {
      list.push({
        name: party.partyMaster.fullName,
        initials: this.generateInitials(party.partyMaster.fullName),
        role: 'Party Master'
      });
    }

    party.apprentices?.forEach((app: any) => {
      list.push({
        name: app.fullName,
        initials: this.generateInitials(app.fullName),
        role: 'Apprentice'
      });
    });

    return list;
  });

  // 5. Reactive Checks
  isInGroup = computed(() => !!this.user()?.currentParty);
  
  activeQuestId = computed(() => {
    const party = this.partyData();
    // Handles both populated object or raw ID string
    return party?.activeQuest?._id || party?.activeQuest || null;
  });

  isPartyMaster = computed(() => this.user()?.role === 'partyMaster');

  constructor() {
    // 6. CHAINED EFFECT: 
    // User Loads -> Get Party ID -> Fetch Party Details -> Fetch Tasks
    effect(() => {
      const userParty = this.user()?.currentParty;
      const partyId = typeof userParty === 'string' ? userParty : userParty?._id;

      if (partyId) {
        // First, fetch the party details
        this.partyService.fetchPartyDetails(partyId).subscribe(party => {
          
          // 3. LOGIC RECOVERY: 
          // If party.activeQuest is null, try to find it via questService
          if (!party.activeQuest) {
            this.questService.getQuestsByParty(partyId).subscribe(quests => {
              // Find the quest that is 'in_progress'
              const active = quests.find(q => q.status === 'in_progress');
              if (active) {
                this.currentQuest.set(active);
                this.taskService.getTasksByQuest(active._id).subscribe();
              }
            });
          } else {
            // Standard flow: Party already has the quest ID linked
            const qId = party.activeQuest._id || party.activeQuest;
            this.taskService.getTasksByQuest(qId).subscribe();
          }
        });
      }
    }, { allowSignalWrites: true });
  }

  // --- Actions ---
  saveTask(): void {
    const questId = this.activeQuestId();
    if (!this.newTaskData.name || !questId) return;

    if (this.editingTaskId) {
      this.taskService.updateTask(this.editingTaskId, this.newTaskData).subscribe(() => this.closeModal());
    } else {
      this.taskService.createTask(questId, this.newTaskData).subscribe(() => this.closeModal());
    }
  }

  toggleTaskStatus(task: Task): void {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    this.taskService.updateTask(task._id, { status: newStatus }).subscribe();
  }

  deleteTask(taskId: string): void {
    if (confirm('Permanently remove this objective?')) {
      this.taskService.deleteTask(taskId).subscribe();
    }
  }

  // --- Helpers ---
  private generateInitials(name: any): string {
    const nameStr = String(name || '').trim();
    if (!nameStr) return '??';

    const parts = nameStr.split(/\s+/);

    const firstChar = parts[0]?.charAt(0) || '';
    const lastChar = parts.length > 1 
      ? parts[parts.length - 1].charAt(0) 
      : '';

    return (firstChar + lastChar).toUpperCase() || '??';
  }

  openEditModal(task: Task) {
    this.editingTaskId = task._id;
    this.newTaskData = { name: task.name, description: task.description };
    this.showAddTask = true;
  }

  closeModal() {
    this.showAddTask = false;
    this.editingTaskId = null;
    this.newTaskData = { name: '', description: '' };
  }
}