import { SetMetadata } from '@nestjs/common';

/**
 * 公开接口装饰器的元数据键
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 公开接口装饰器
 * 标记不需要JWT验证的接口
 *
 * @example
 * ```typescript
 * @Public()
 * @Get('public-data')
 * getPublicData() {
 *   return 'This is public';
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
