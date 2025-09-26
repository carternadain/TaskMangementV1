// apps/api/src/app/users/entities/user.entity.ts
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
  assignedTasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy?: User;
  assignedToId?: string;
  assignedTo?: User;
  teamId?: string;
  team?: Team;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  members?: User[];
  tasks?: Task[];
}