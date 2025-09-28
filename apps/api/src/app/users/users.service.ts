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
    return this.users.map(user => {
      const { password, ...result } = user;
      return result as User;
    });
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);
    if (user) {
      const { password, ...result } = user;
      return result as User;
    }
    return undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email: userData.email!,
      name: userData.name!,
      password: userData.password!,
      role: userData.role || UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.push(newUser);
    const { password, ...result } = newUser;
    return result as User;
  }
}