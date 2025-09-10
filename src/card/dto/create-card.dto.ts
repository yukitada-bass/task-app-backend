import { IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  listId: string;
}
