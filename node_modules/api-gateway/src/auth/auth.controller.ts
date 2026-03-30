import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    // Hardcoded credentials for MVP. In reality, this would hit the DB.
    if (signInDto.email === 'admin@merkatomotors.com' && signInDto.password === 'admin123') {
      const payload = { sub: 1, username: 'admin', role: 'admin' };
      return {
        success: true,
        data: {
          access_token: await this.jwtService.signAsync(payload),
          user: { name: 'Admin User', role: 'admin', email: 'admin@merkatomotors.com' }
        }
      };
    }
    
    // Vendor/Supplier Login Mock
    if (signInDto.email === 'supplier@merkatomotors.com' && signInDto.password === 'vendor123') {
      const payload = { sub: 2, username: 'supplier', role: 'supplier' };
      return {
        success: true,
        data: {
          access_token: await this.jwtService.signAsync(payload),
          user: { name: 'Nyala Motors', role: 'supplier', email: 'supplier@merkatomotors.com' }
        }
      };
    }

    throw new UnauthorizedException({ success: false, message: 'Invalid credentials' });
  }
}
