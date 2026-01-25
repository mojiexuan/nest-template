import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

/**
 * XSS 防护中间件
 * 过滤请求体中的 XSS 攻击代码
 */
@Injectable()
export class XssMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitize(req.body);
    }
    next();
  }

  private sanitize(obj: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const key in obj) {
      const value = obj[key];

      if (typeof value === 'string') {
        sanitized[key] = xss(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === 'string'
            ? xss(item)
            : typeof item === 'object' && item !== null
              ? this.sanitize(item as Record<string, unknown>)
              : item,
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}
