import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTag, ApiOperation, HttpMethod } from 'docupress-api';
import { Public } from '@common/decorators/public.decorator';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

/**
 * 认证控制器
 * 处理登录、登出等认证相关请求
 */
@ApiTag({ name: '认证', description: '登录、登出、刷新Token' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    method: HttpMethod.POST,
    path: '/api/auth/login',
    summary: '用户登录',
    body: LoginDto,
  })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    method: HttpMethod.POST,
    path: '/api/auth/logout',
    summary: '用户登出',
  })
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    if (token) {
      await this.authService.logout(token);
    }
  }

  @ApiOperation({
    method: HttpMethod.POST,
    path: '/api/auth/refresh',
    summary: '刷新Token',
  })
  @Post('refresh')
  async refresh(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    const newToken = await this.authService.refreshToken(token);
    return { token: newToken };
  }
}
