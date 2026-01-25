import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

/**
 * 定时任务服务
 * 示例：包含常用的定时任务模式
 */
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  /**
   * 每天凌晨 3 点执行
   * 示例：清理过期数据
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  handleDailyCleanup() {
    this.logger.log('执行每日清理任务...');
    // TODO: 实现清理逻辑
  }

  /**
   * 每小时执行一次
   * 示例：同步数据
   */
  @Cron(CronExpression.EVERY_HOUR)
  handleHourlySync() {
    this.logger.debug('执行每小时同步任务...');
    // TODO: 实现同步逻辑
  }

  /**
   * 每 30 秒执行一次
   * 示例：健康检查
   */
  @Interval(30000)
  handleHealthCheck() {
    this.logger.debug('执行健康检查...');
    // TODO: 实现健康检查逻辑
  }

  /**
   * 应用启动 10 秒后执行一次
   * 示例：初始化缓存
   */
  @Timeout(10000)
  handleStartupInit() {
    this.logger.log('执行启动初始化任务...');
    // TODO: 实现初始化逻辑
  }
}
