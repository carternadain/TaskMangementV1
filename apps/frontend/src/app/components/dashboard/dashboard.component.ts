import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { TasksService, Task, TaskStats } from '../../services/tasks.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <h1 class="text-3xl font-bold text-gray-900">Task Management</h1>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">Welcome, {{ currentUser?.name }}</span>
              <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{{ currentUser?.role }}</span>
              <button 
                (click)="logout()"
                class="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">{{ stats?.total || 0 }}</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats?.total || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">{{ stats?.todo || 0 }}</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">To Do</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats?.todo || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">{{ stats?.inProgress || 0 }}</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats?.inProgress || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">{{ stats?.done || 0 }}</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Done</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats?.done || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Task Form -->
        <div class="bg-white shadow rounded-lg mb-8">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Task</h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  [(ngModel)]="newTask.title"
                  placeholder="Task title"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div>
                <select
                  [(ngModel)]="newTask.priority"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>
            <div class="mt-4">
              <textarea
                [(ngModel)]="newTask.description"
                placeholder="Task description"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              ></textarea>
            </div>
            <div class="mt-4">
              <button
                (click)="createTask()"
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>

        <!-- Tasks List -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Tasks</h3>
          </div>
          <ul class="divide-y divide-gray-200">
            <li *ngFor="let task of tasks" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': task.status === 'todo',
                        'bg-blue-100 text-blue-800': task.status === 'in-progress',
                        'bg-green-100 text-green-800': task.status === 'done'
                      }"
                    >
                      {{ task.status }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
                    <div class="text-sm text-gray-500">{{ task.description }}</div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                    [ngClass]="{
                      'bg-gray-100 text-gray-800': task.priority === 'low',
                      'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                      'bg-red-100 text-red-800': task.priority === 'high'
                    }"
                  >
                    {{ task.priority }}
                  </span>
                  <select
                    [value]="task.status"
                    (change)="updateTaskStatus(task, $event)"
                    class="text-sm border-gray-300 rounded px-2 py-1"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button
                    (click)="deleteTask(task.id)"
                    class="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  tasks: Task[] = [];
  stats: TaskStats | null = null;
  newTask = {
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  };

  constructor(
    private authService: AuthService,
    private tasksService: TasksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadTasks();
    this.loadStats();
  }

  loadTasks(): void {
    this.tasksService.getAllTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  loadStats(): void {
    this.tasksService.getTaskStats().subscribe({
      next: (stats) => this.stats = stats,
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  createTask(): void {
    if (!this.newTask.title.trim()) return;
    
    this.tasksService.createTask(this.newTask).subscribe({
      next: (task) => {
        this.tasks.unshift(task);
        this.newTask = { title: '', description: '', priority: 'medium' };
        this.loadStats();
      },
      error: (err) => console.error('Error creating task:', err)
    });
  }

  updateTaskStatus(task: Task, event: any): void {
    const newStatus = event.target.value as 'todo' | 'in-progress' | 'done';
    this.tasksService.updateTask(task.id, { status: newStatus }).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.loadStats();
      },
      error: (err) => console.error('Error updating task:', err)
    });
  }

  deleteTask(taskId: string): void {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    this.tasksService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.loadStats();
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}