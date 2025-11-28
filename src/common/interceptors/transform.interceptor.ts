import { Injectable, type CallHandler, type ExecutionContext, type NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';

/**
 * 响应数据接口
 * @template T - 数据类型
 */
export interface Response<T> {
  code: number;
  message: string;
  data?: T;
  time: string;
}

/**
 * 响应转换拦截器
 * 统一包装所有成功的响应数据
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * 拦截并转换响应数据
   * @param context - 执行上下文
   * @param next - 调用处理器
   * @returns 转换后的响应Observable
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response: Response<T> = {
          code: 200,
          message: '操作成功',
          time: new Date().toISOString(),
        };

        // 只有当 data 存在且不为空时才添加 data 字段
        if (data !== null && data !== undefined) {
          response.data = data;
        }

        return response;
      }),
    );
  }
}
