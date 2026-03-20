import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quest } from '../admin-quest';

@Component({
  selector: 'app-quest-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quest-table.html',
  styleUrl: './quest-table.css'
})
export class QuestTable {
  @Input() quests: Quest[] = [];
}