// apps/api/src/app/auth/auth.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (user) {
      return this.authService.login(user);
    }
    return { success: false, message: 'Invalid credentials' };
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string }) {
    try {
      return await this.authService.register(body);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('test')
  test() {
    return { message: 'Auth endpoint working!' };
  }
}