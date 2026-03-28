import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto, ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      message: 'Registration successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      accessToken: result.accessToken,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      accessToken: result.accessToken,
    };
  }

  @Post('password/request-reset')
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    const token = await this.authService.requestPasswordReset(requestPasswordResetDto.email);
    return {
      message: 'If the email exists, a reset link has been sent',
      // Remove this in production! Only for development
      resetToken: token,
    };
  }

  @Post('password/reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    return {
      message: 'Password reset successful',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.authService.getUserProfile(req.user.userId);
    return {
      id: user.id,
      email: user.email,
      name: user.name, role: user.role, createdAt: user.createdAt,
    };
  }
}
