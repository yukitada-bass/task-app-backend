import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ListService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createListDto: CreateListDto) {
    const { title, boardId } = createListDto;
    const maxPosition = await this.prismaService.list.aggregate({
      _max: { position: true },
      where: { boardId },
    });

    const position = (maxPosition._max.position ?? 0) + 1;

    return await this.prismaService.list.create({
      data: {
        title,
        boardId,
        position,
      },
    });
  }

  findAll() {
    return `This action returns all list`;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  update(id: number, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
