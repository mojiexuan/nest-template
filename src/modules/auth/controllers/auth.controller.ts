import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

/**
 * 认证控制器
 * 处理登录、登出等认证相关请求
 */
@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: '用户登出' })
  @ApiBearerAuth('JWT-auth')
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    if (token) {
      await this.authService.logout(token);
    }
  }

  @ApiOperation({ summary: '刷新Token' })
  @ApiBearerAuth('JWT-auth')
  @Post('refresh')
  async refresh(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    const newToken = await this.authService.refreshToken(token);
    return { token: newToken };
  }
}
