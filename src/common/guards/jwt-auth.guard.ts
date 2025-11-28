import { Injectable, UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';

/**
 * JWT认证守卫
 * 全局守卫，自动验证所有请求的JWT Token
 * 使用@Public()装饰器可跳过验证
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * 判断是否可以激活路由
   * @param context - 执行上下文
   * @returns 是否可以访问
   */
  canActivate(context: ExecutionContext) {
    // 检查是否标记为公开接口
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // 调用父类方法进行JWT验证
    return super.canActivate(context);
  }

  /**
   * 处理请求
   * @param err - 错误
   * @param user - 用户信息
   * @param info - 附加信息
   * @param context - 执行上下文
   * @param status - 状态
   * @returns 用户信息
   */
  handleRequest<TUser = string>(
    err: Error | null,
    user: TUser | null,
    _info: unknown,
    _context: ExecutionContext,
    _status?: unknown,
  ): TUser {
    if (err ?? !user) {
      throw err ?? new UnauthorizedException('未授权访问');
    }
    return user;
  }
}
