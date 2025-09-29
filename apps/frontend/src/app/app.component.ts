import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="max-w-md w-full bg-white shadow rounded-lg px-4 py-6">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Task Manager Login</h2>
        
        <div *ngIf="error" class="bg-red-100 border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
          {{ error }}
        </div>

        <div class="space-y-4">
          <input
            type="email"
            [(ngModel)]="email"
            placeholder="Email"
            class="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            [(ngModel)]="password"
            placeholder="Password"
            class="w-full px-4 py-2 border rounded-md"
          />
          <button
            (click)="login()"
            class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Login
          </button>
        </div>

        <p class="text-sm text-gray-600 mt-4">
          Demo: admin@example.com / admin123
        </p>

        <div *ngIf="loggedIn" class="mt-8">
          <h3 class="text-lg font-bold mb-4">Welcome! Tasks loaded successfully.</h3>
          <div *ngFor="let task of tasks" class="border rounded-md px-4 py-2 mb-2">
            <div class="font-bold">{{ task.title }}</div>
            <div class="text-sm text-gray-600">Status: {{ task.status }} | Priority: {{ task.priority }}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  email = '';
  password = '';
  error = '';
  loggedIn = false;
  tasks: any[] = [];

  constructor(private http: HttpClient) {}

  login() {
    this.http.post<any>('http://localhost:3333/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        if (response.success || response.user) {
          this.loggedIn = true;
          this.error = '';
          this.loadTasks();
        } else {
          this.error = 'Login failed';
        }
      },
      error: (err) => {
        this.error = 'Cannot connect to server. Is the backend running?';
      }
    });
  }

  loadTasks() {
    this.http.get<any[]>('http://localhost:3333/api/tasks').subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (err) => console.error(err)
    });
  }
}