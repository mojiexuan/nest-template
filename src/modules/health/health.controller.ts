import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { ApiTag, ApiOperation, HttpMethod } from 'docupress-api';
import { Public } from '@common/decorators/public.decorator';
import { getFeatureStatus } from '@config/features.config';

@ApiTag({ name: '健康检查', description: '服务健康状态' })
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @ApiOperation({
    method: HttpMethod.GET,
    path: '/api/health',
    summary: '健康检查',
    rawResponse: true,
  })
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

  @ApiOperation({
    method: HttpMethod.GET,
    path: '/api/health/liveness',
    summary: '存活检查',
    rawResponse: true,
  })
  @Public()
  @Get('liveness')
  liveness() {
    return { status: 'ok' };
  }

  @ApiOperation({
    method: HttpMethod.GET,
    path: '/api/health/readiness',
    summary: '就绪检查',
    rawResponse: true,
  })
  @Public()
  @Get('readiness')
  readiness() {
    return { status: 'ok' };
  }

  @ApiOperation({
    method: HttpMethod.GET,
    path: '/api/health/features',
    summary: '功能状态',
    rawResponse: true,
  })
  @Public()
  @Get('features')
  features() {
    return getFeatureStatus();
  }
}
