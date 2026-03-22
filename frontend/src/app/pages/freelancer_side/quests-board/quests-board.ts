import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../components/navbar/navbar';

export interface Task {
  name: string;
  quest: string;
  image: string;
  status: 'In Progress' | 'Completed';
  assignee: string;
}

export interface Member {
  name: string;
  initials: string;
  role: string;
}

@Component({
  selector: 'app-quests-board',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './quests-board.html',
  styleUrl: './quests-board.css'
})
export class QuestsBoard {

  role: 'apprentice' | 'party-master' = 'party-master';
  activeTab = 'tasks';
  showAddTask = false;
  newMessage = '';
  newTask: Partial<Task> = { name: '', quest: '', assignee: '' };

  members: Member[] = [
    { name: 'John Doe',       initials: 'JD', role: 'Frontend' },
    { name: 'Jane Smith',     initials: 'JS', role: 'Designer' },
    { name: 'David Williams', initials: 'DW', role: 'Backend'  },
    { name: 'Maria Santos',   initials: 'MS', role: 'Client'   },
  ];

  get partyMembers(): Member[] { return this.members.filter(m => m.role !== 'Client'); }

  tasks: Task[] = [
    { name: 'Setup Project Structure',  quest: 'E-Commerce Website Development', image: 'images/quest-ecommerce.png', status: 'Completed',   assignee: 'Jane Smith'     },
    { name: 'Design UI Wireframes',     quest: 'E-Commerce Website Development', image: 'images/quest-ecommerce.png', status: 'Completed',   assignee: 'Jane Smith'     },
    { name: 'User Authentication',      quest: 'E-Commerce Website Development', image: 'images/quest-ecommerce.png', status: 'Completed',   assignee: 'John Doe'       },
    { name: 'Build Product Listing UI', quest: 'E-Commerce Website Development', image: 'images/quest-ecommerce.png', status: 'In Progress', assignee: 'John Doe'       },
    { name: 'Integrate Database',       quest: 'E-Commerce Website Development', image: 'images/quest-ecommerce.png', status: 'Completed',   assignee: 'David Williams' },
    { name: 'Application of API',       quest: 'E-Commerce Website Development', image: 'images/quest-ecommerce.png', status: 'In Progress', assignee: 'David Williams' },
  ];

  partyMessages = [
    { sender: 'party',        initials: 'JJ', name: 'Jeff Johnson', text: "Hey team, let's sync up on the API integration task. Any blockers?" },
    { sender: 'party-master', initials: 'DW', name: '',             text: "I'm working on the authentication endpoints. Should be done by tomorrow." },
    { sender: 'party',        initials: 'JS', name: 'Jane Smith',   text: "I've finished the UI screens for mobile. Ready for review!" },
    { sender: 'party-master', initials: 'DW', name: '',             text: "Great work Jane! I'll review it after I finish the endpoints." },
    { sender: 'party',        initials: 'JJ', name: 'Jeff Johnson', text: "Awesome progress everyone! Let's aim to complete all tasks by end of week." },
  ];

  pmMessages = [
    { sender: 'apprentice',   initials: 'JS', name: 'Jane Smith',   text: "Hi! We've completed the UI wireframes and started on the frontend components." },
    { sender: 'client',       initials: 'MS', name: 'Maria Santos', text: 'Great progress! Please make sure the design matches the specs I sent earlier.' },
    { sender: 'apprentice',   initials: 'JD', name: 'John Doe',     text: 'Working on the product listing UI now. Should be done by tomorrow.' },
    { sender: 'party-master', initials: 'DW', name: '',             text: "Thanks everyone! We're on track. Will update you once Milestone 2 is done." },
  ];

  editingIndex: number | null = null;

  editTask(task: Task, index: number): void {
    this.editingIndex = index;
    this.newTask = { ...task };
    this.showAddTask = true;
  }

  deleteTask(index: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks.splice(index, 1);
    }
  }

  addTask(): void {
    if (this.newTask.name && this.newTask.assignee) {
      if (this.editingIndex !== null) {
        this.tasks[this.editingIndex] = {
          name: this.newTask.name!,
          quest: this.newTask.quest || 'E-Commerce Website Development',
          image: 'images/quest-ecommerce.png',
          status: this.tasks[this.editingIndex].status,
          assignee: this.newTask.assignee!
        };
        this.editingIndex = null;
      } else {
        if (this.tasks.length >= 10) return;
        this.tasks.push({
          name: this.newTask.name!,
          quest: this.newTask.quest || 'E-Commerce Website Development',
          image: 'images/quest-ecommerce.png',
          status: 'In Progress',
          assignee: this.newTask.assignee!
        });
      }
      this.newTask = { name: '', quest: '', assignee: '' };
      this.showAddTask = false;
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.pmMessages.push({ sender: 'party', initials: 'ME', name: 'You', text: this.newMessage.trim() });
      this.newMessage = '';
    }
  }
}