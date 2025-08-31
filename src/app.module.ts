import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { BoardModule } from './board/board.module';
import { CardModule } from './card/card.module';
import { ListModule } from './list/list.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, WorkspaceModule, BoardModule, CardModule, ListModule],
})
export class AppModule {}
