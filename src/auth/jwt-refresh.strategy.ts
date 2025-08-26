import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from 'src/types/Payload';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    payload: Payload,
  ): Promise<{ id: string; name: string; }> {
    // ① クライアントから送られてきた refresh_token（Cookieから取り出す）
    const refreshToken = req.cookies.refresh_token;

    // ② ユーザー情報をDBから取得
    const user = await this.userService.getUser(payload.sub);

    // ③ DBに保存している refreshToken が存在しない場合はエラー
    if (!user.refreshToken) throw new UnauthorizedException();

    // ④ 平文の refresh_token と、DBに保存されているハッシュ化済み refreshToken を比較
    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

    // ⑤ 一致しなければエラー
    if (!isValid) throw new UnauthorizedException();

    // ⑥ 認証OKならユーザー情報を返す
    return { id: user.id, name: user.name };
  }
}
