import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConfig } from '@config';
import { AuthService } from '../services/auth.service';

/**
 * JWT策略
 * 用于验证JWT Token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
      passReqToCallback: true,
    });
  }

  /**
   * 验证JWT payload
   * @param req - 请求对象
   * @param payload - JWT payload
   * @returns 用户ID
   */
  async validate(req: Request, payload: { sub: string }) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!token) {
      throw new UnauthorizedException('Token不存在');
    }

    // 验证token是否在Redis中存在
    const userId = await this.authService.validateToken(token);

    if (!userId || userId !== payload.sub) {
      throw new UnauthorizedException('Token无效');
    }

    // 返回userId，会自动注入到request.user
    return userId;
  }
}
