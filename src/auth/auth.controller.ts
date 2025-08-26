import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { Credentials } from './dto/credentials.dto';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('signup')
  async signupHandler(@Body() userData: CreateUserDto): Promise<User> {
    return await this.AuthService.signup(userData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginHandler(
    @Body() credentials: Credentials,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.AuthService.login(credentials);

    // リフレッシュトークンは HttpOnly Cookie にセット
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // 本番では true
      sameSite: 'none', // 本番では 'strict'
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // アクセストークンは return
    return { accessToken };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: any): Promise<{ accessToken: string }> {
    return await this.AuthService.refresh(req.user);
  }
}
