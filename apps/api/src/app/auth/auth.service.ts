import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(email: string, password: string) {
    // Simple validation for now
    if (email === 'admin@example.com' && password === 'admin123') {
      return { id: '1', email, name: 'Admin User' };
    }
    return null;
  }
}