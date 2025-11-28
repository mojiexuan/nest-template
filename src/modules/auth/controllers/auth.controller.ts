import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '@common/decorators/public.decorator';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

/**
 * 认证控制器
 * 处理登录、登出等认证相关请求
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * @param loginDto - 登录数据
   * @returns Token和用户信息
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * 用户登出
   * @param authorization - Authorization请求头
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    if (token) {
      await this.authService.logout(token);
    }
  }

  /**
   * 刷新Token
   * @param authorization - Authorization请求头
   * @returns 新Token
   */
  @Post('refresh')
  async refresh(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    const newToken = await this.authService.refreshToken(token);
    return { token: newToken };
  }
}
