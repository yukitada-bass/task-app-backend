import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createBoardDto: CreateBoardDto) {
    return this.prismaService.board.create({
      data: createBoardDto,
    });
  }

  findAll(userId: string) {
    return this.prismaService.board.findMany({
      where: {
        workspace: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
      include: {
        workspace: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  findAllByWorkspaceId(workspaceId: string) {
    return this.prismaService.board.findMany({
      where: {
        workspaceId,
      },
    });
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
