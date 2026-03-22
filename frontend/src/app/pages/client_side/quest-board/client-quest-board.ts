import { ClientBackground } from '../client-background';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../components/navbar/navbar';

@Component({
  selector: 'app-client-quest-board',
  imports: [CommonModule, Navbar, ClientBackground],
  templateUrl: './client-quest-board.html',
  styleUrl: './client-quest-board.css'
})
export class ClientQuestBoard {

  milestones = [
    { name: 'Milestone 1', description: 'UI Wireframes',        status: 'Completed'   },
    { name: 'Milestone 2', description: 'Frontend Development', status: 'In Progress' },
    { name: 'Milestone 3', description: 'Backend Integration',  status: 'Pending'     },
    { name: 'Milestone 4', description: 'Final Testing',        status: 'Pending'     },
  ];

  activityLogs = [
    { initials: 'JJ', text: 'Jeff Johnson submitted Milestone 2 for review.',              time: '5 mins ago'  },
    { initials: '👥', text: 'Party updated quest progress to 65%',                         time: '20 mins ago' },
    { initials: 'JJ', text: 'Jeff Johnson requested feedback for frontend implementation',  time: '1 hr ago'    },
    { initials: '👥', text: 'Party uploaded UI files to GitHub repository',                 time: 'Yesterday'   },
    { initials: 'ME', text: 'You approved UI Wireframes for Milestone 1',                  time: '2 days ago'  },
  ];

  messages = [
    { sender: 'party',  initials: 'JJ', name: 'Jeff Johnson', text: 'Hey, just finished the wireframes for the dashboard. Can you check and approve them?' },
    { sender: 'client', initials: 'ME', name: 'You',          text: 'Looks great! The layout is clean. Approved. You can proceed to frontend development.' },
    { sender: 'party',  initials: 'JJ', name: 'Jeff Johnson', text: "Thanks! We've started on the Angular components. The sidebar and header are done."    },
    { sender: 'client', initials: 'ME', name: 'You',          text: 'Perfect. Make sure the color theme matches the design specs I sent earlier.'          },
    { sender: 'party',  initials: 'JJ', name: 'Jeff Johnson', text: "Got it. We're also working on the chart components. Should be done by tomorrow."      },
    { sender: 'client', initials: 'ME', name: 'You',          text: 'Great progress! Keep me updated on Milestone 2 completion.'                           },
  ];
}