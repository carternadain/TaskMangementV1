import { Injectable } from '@nestjs/common';
import { Task, TaskStatus, TaskPriority } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Setup Project',
      description: 'Initial project setup with NX',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      createdAt: new Date('2025-09-20'),
      updatedAt: new Date(),
      createdById: '1',
      assignedToId: '1',
    },
    {
      id: '2',
      title: 'Build Authentication',
      description: 'Implement login/register functionality',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      createdAt: new Date('2025-09-22'),
      updatedAt: new Date(),
      createdById: '1',
      assignedToId: '2',
    },
    {
      id: '3',
      title: 'Create Frontend',
      description: 'Build Angular frontend with task management',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: '1',
      assignedToId: '2',
    },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  create(taskData: Partial<Task>): Task {
    const newTask: Task = {
      id: (this.tasks.length + 1).toString(),
      title: taskData.title || 'New Task',
      description: taskData.description,
      status: taskData.status || TaskStatus.TODO,
      priority: taskData.priority || TaskPriority.MEDIUM,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: '1',
      assignedToId: taskData.assignedToId,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  update(id: string, updateData: Partial<Task>): Task | null {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updateData, updatedAt: new Date() };
      return this.tasks[index];
    }
    return null;
  }

  remove(id: string): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  getStats() {
    return {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === TaskStatus.TODO).length,
      inProgress: this.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      done: this.tasks.filter(t => t.status === TaskStatus.DONE).length,
    };
  }
}