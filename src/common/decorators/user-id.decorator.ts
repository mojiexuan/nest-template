import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

/**
 * 用户ID装饰器
 * 自动从请求中提取已验证的用户ID
 *
 * @example
 * ```typescript
 * @Get('profile')
 * getProfile(@UserId() userId: string) {
 *   return this.userService.findOne(userId);
 * }
 * ```
 */
export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  return request.user; // JWT strategy返回的userId
});
