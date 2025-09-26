// apps/api/src/app/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'admin123',
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      password: 'user123',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
}