import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../components/navbar/navbar';
import { FreelancerBackground } from '../freelancer-background';
import { QuestService, Quest } from '../../../core/services/quest.service';
@Component({
  selector: 'app-freelancer-quests',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, FreelancerBackground],
  templateUrl: './quests.html',
  styleUrl: './quests.css'
})
export class FreelancerQuests implements OnInit {
  private questService = inject(QuestService);

  searchTerm = signal('');
  selectedSkill = signal('');
  selectedReward = signal('');
  selectedDifficulty = signal('');
  
  allQuests = this.questService.quests; 

  filteredQuests = computed(() => {
    return this.allQuests().filter(q => {
      const search = this.searchTerm().toLowerCase();
      const matchesSearch = q.title.toLowerCase().includes(search) || 
                            q.commissioner?.fullName?.toLowerCase().includes(search);
      
      const matchesSkill = !this.selectedSkill() || 
                           q.techStack.some(s => s.toLowerCase().includes(this.selectedSkill().toLowerCase()));
      
      const matchesDifficulty = !this.selectedDifficulty() || 
                                this.getDifficulty(q) === this.selectedDifficulty();

      return matchesSearch && matchesSkill && matchesDifficulty
    });
  });

  recommendedQuests = computed(() => this.allQuests().slice(0, 3));

  ngOnInit(): void {
    this.questService.getQuests().subscribe({
      error: (err) => console.error('Quest Hub Error:', err)
    });
  }

  private getDifficulty(quest: Quest): string {
    if (quest.techStack.length > 5) return 'Hard';
    if (quest.techStack.length > 2) return 'Medium';
    return 'Easy';
  }

  onSearchChange(value: string) { this.searchTerm.set(value); }
  onSkillChange(value: string) { this.selectedSkill.set(value); }
  onDifficultyChange(value: string) { this.selectedDifficulty.set(value); }
}