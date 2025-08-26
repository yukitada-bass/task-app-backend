import { IsEmail, IsString, MinLength } from 'class-validator';

export class Credentials {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'パスワードは8文字で入力してください' })
  password: string;
}
