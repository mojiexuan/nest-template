import { Injectable } from '@nestjs/common';

/**
 * 应用程序根服务
 * 提供基础服务功能
 */
@Injectable()
export class AppService {
  /**
   * 获取服务健康状态
   * @returns 返回健康状态消息
   */
  getHealth(): string {
    return 'Chenille Server is running!';
  }
}
