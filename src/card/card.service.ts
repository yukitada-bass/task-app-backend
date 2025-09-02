import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CardService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createListDto: CreateCardDto) {
    const { title, description, listId } = createListDto;
    const maxPosition = await this.prismaService.card.aggregate({
      _max: { position: true },
      where: { listId },
    });

    const position = (maxPosition._max.position ?? 0) + 1;

    return await this.prismaService.card.create({
      data: {
        title,
        description: description ?? null,
        listId,
        position,
      },
    });
  }

  async addMember(cardId: string, userId: string) {
    return this.prismaService.cardMember.create({
      data: {
        cardId,
        userId,
      },
      include: { user: true, card: true },
    });
  }

  findAll() {
    return `This action returns all card`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
