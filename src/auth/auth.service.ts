import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Credentials } from './dto/credentials.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Payload } from 'src/types/Payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // サインアップ処理
  async signup(data: CreateUserDto): Promise<User> {
    try {
      const { name, email, password } = data;
      const hashedPw = await bcrypt.hash(password, 10);
      return await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPw,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException(
          'このメールアドレスはすでに登録されています',
        );
      }
      throw new InternalServerErrorException('サーバーエラーが発生しました');
    }
  }

  // ログイン処理
  async login(
    data: Credentials,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new UnauthorizedException();
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException();

    const payload: Payload = {
      username: user.name,
      sub: user.id,
    };

    // アクセストークンとリフレッシュトークンを同時並行で生成
    const [accessToken, refreshToken] = await Promise.all([
      // アクセストークン
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '1h',
      }),
      // リフレッシュトークン
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      }),
    ]);

    // リフレッシュトークンをハッシュ化してDBに保存
    const hashedRT = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        refreshToken: hashedRT,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(user: {
    name: string;
    id: string;
  }): Promise<{ accessToken: string }> {
    const payload: Payload = {
      username: user.name,
      sub: user.id,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });
    return { accessToken };
  }

  // ロウアウト処理
  async logout() {}
}
