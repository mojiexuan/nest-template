import { Controller, Get } from '@nestjs/common';
import { Public } from '@common/decorators/public.decorator';
import { AppService } from './app.service';

/**
 * 应用程序根控制器
 * 提供基础健康检查接口
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 健康检查接口（公开）
   * @returns 返回服务状态信息
   */
  @Public()
  @Get()
  getHealth(): string {
    return this.appService.getHealth();
  }
}
