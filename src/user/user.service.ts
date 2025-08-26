import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 全ユーザー取得
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany();
      if (!users) throw new NotFoundException(`ユーザーが存在しません`);
      return users;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('サーバーエラーが発生しました');
    }
  }

  // ユーザー取得
  async getUser(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`ユーザーが存在しません`);
      return user;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('サーバーエラーが発生しました');
    }
  }

  // ユーザー更新
  async updateUser(id: string, data: CreateUserDto): Promise<User | null> {
    try {
      const { name, email, password } = data;
      const hashedPw = await bcrypt.hash(password, 10);
      return this.prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          password: hashedPw,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('指定のユーザーは存在しません');
      }
      console.error(err);
      throw new InternalServerErrorException('サーバーエラーが発生しました。');
    }
  }

  // ユーザー削除
  async deleteUser(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('指定のユーザーは存在しません');
      }
      throw new InternalServerErrorException('サーバーエラーが発生しました');
    }
  }
}
