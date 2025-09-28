import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === password) { // In production, use bcrypt
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      permissions: this.getUserPermissions(user),
    };
  }

  async register(registerData: { email: string; password: string; name: string }) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerData.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Create new user with default role
    const newUser = await this.usersService.create({
      ...registerData,
      role: UserRole.USER,
    });

    return this.login(newUser);
  }

  getUserPermissions(user: User) {
    const basePermissions = ['tasks:read', 'tasks:create', 'tasks:update:own'];
    
    switch (user.role) {
      case UserRole.ADMIN:
        return [
          ...basePermissions,
          'tasks:update:all',
          'tasks:delete:all',
          'users:read',
          'users:create',
          'users:update',
          'users:delete',
          'analytics:view',
        ];
      case UserRole.MANAGER:
        return [
          ...basePermissions,
          'tasks:update:team',
          'tasks:delete:own',
          'users:read:team',
          'analytics:view',
        ];
      case UserRole.USER:
        return [
          ...basePermissions,
          'tasks:delete:own',
        ];
      default:
        return basePermissions;
    }
  }
}