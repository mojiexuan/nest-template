import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { Public } from '@common/decorators/public.decorator';
import { getFeatureStatus } from '@config/features.config';

@ApiTags('健康检查')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @ApiOperation({ summary: '健康检查' })
  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 内存检查 (堆内存不超过 300MB)
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      // 磁盘检查 (使用率不超过 90%)
      () =>
        this.disk.checkStorage('disk', { thresholdPercent: 0.9, path: process.platform === 'win32' ? 'C:\\' : '/' }),
    ]);
  }

  @ApiOperation({ summary: '存活检查' })
  @Public()
  @Get('liveness')
  liveness() {
    return { status: 'ok' };
  }

  @ApiOperation({ summary: '就绪检查' })
  @Public()
  @Get('readiness')
  readiness() {
    return { status: 'ok' };
  }

  @ApiOperation({ summary: '功能状态' })
  @Public()
  @Get('features')
  features() {
    return getFeatureStatus();
  }
}
