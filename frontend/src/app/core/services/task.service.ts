import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Task {
  _id: string;
  name: string;
  description: string;
  taskNum: number;
  quest: string;
  partyMaster: any;
  status: 'todo' | 'done'; 
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/tasks`;

  // Signal to store tasks for the currently viewed quest
  private readonly _currentQuestTasks = signal<Task[]>([]);
  readonly currentQuestTasks = this._currentQuestTasks.asReadonly();

  /**
   * Fetch all tasks for a specific quest (GET /tasks/quest/:questId)
   */
  getTasksByQuest(questId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API}/quest/${questId}`).pipe(
      tap(tasks => this._currentQuestTasks.set(tasks))
    );
  }

  /**
   * Create a new task (POST /tasks/quest/:questId)
   * Only the Party Master assigned to the quest can perform this.
   */
  createTask(questId: string, taskData: { name: string; description: string }): Observable<Task> {
    return this.http.post<Task>(`${this.API}/quest/${questId}`, taskData).pipe(
      tap(newTask => {
        // Update the signal to include the new task at the top
        this._currentQuestTasks.update(tasks => [newTask, ...tasks]);
      })
    );
  }

  /**
   * Update task details (PUT /tasks/:id)
   */
  updateTask(taskId: string, updates: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.API}/${taskId}`, updates).pipe(
      tap(updatedTask => {
        this._currentQuestTasks.update(tasks =>
          tasks.map(t => t._id === taskId ? updatedTask : t)
        );
      })
    );
  }

  /**
   * Delete a task (DELETE /tasks/:id)
   */
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.API}/${taskId}`).pipe(
      tap(() => {
        this._currentQuestTasks.update(tasks => 
          tasks.filter(t => t._id !== taskId)
        );
      })
    );
  }
}