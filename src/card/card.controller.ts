import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Get()
  findAllByUserId(@Req() req: any) {
    const { id: userId } = req.user;
    return this.cardService.findAllByUserId(userId);
  }

  @Get('list/:listId')
  findAllByListId(@Param('listId') listId: string) {
    return this.cardService.findAllByListId(listId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(id, updateCardDto);
  }

  @Patch(':id/members') // 本人以外のメンバーも追加するので@Reqではなく@BodyからuserIdを取得
  addMember(@Param('id') cardId: string, @Body() body: { userId: string }) {
    return this.cardService.addMember(cardId, body.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }
}
