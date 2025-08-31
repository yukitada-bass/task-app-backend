import { IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  listId: string;
}
