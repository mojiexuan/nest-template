import { Catch, HttpException, HttpStatus, type ArgumentsHost, type ExceptionFilter, Logger } from '@nestjs/common';
import type { Response } from 'express';

/**
 * 全局异常过滤器
 * 捕获所有异常（包括HTTP异常和未预期的错误），返回标准化的错误响应
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * 捕获并处理所有异常
   * @param exception - 捕获的异常对象
   * @param host - 参数主机对象
   */
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    // 判断是否为HTTP异常
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 提取错误消息
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse && typeof exceptionResponse === 'object') {
        const errorObj = exceptionResponse as Record<string, unknown>;
        const errorMessage = errorObj.message ?? errorObj.error ?? '请求失败';
        // 如果是数组（多个验证错误），合并为字符串
        if (Array.isArray(errorMessage)) {
          message = errorMessage.join('; ');
        } else {
          message = String(errorMessage);
        }
      }
    } else {
      // 非HTTP异常（未预期的错误）
      this.logger.error(`未捕获的异常: ${exception.message}`, exception.stack);

      // 在开发环境返回详细错误信息，生产环境隐藏
      if (process.env.NODE_ENV === 'development') {
        message = `服务器错误: ${exception.message}`;
      }
    }

    response.status(status).json({
      code: status,
      message,
      time: new Date().toISOString(),
    });
  }
}
