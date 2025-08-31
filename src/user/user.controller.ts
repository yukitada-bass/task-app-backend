import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsersHandler(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserHandler(@Param('id') id: string): Promise<User> {
    return await this.userService.getUser(id);
  }

  @Patch(':id')
  async updateUserHandler(
    @Param('id') id: string,
    @Body() data: CreateUserDto,
  ): Promise<User | null> {
    return await this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUserHandler(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.userService.deleteUser(id);
    return { success: true, message: 'ユーザーを削除しました' };
  }
}
