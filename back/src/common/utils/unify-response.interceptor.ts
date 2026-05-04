import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MyLoggerService } from '../winston-logger/logger';
import { getReqMainInfo } from './get-req-info';

@Injectable()
export default class UnifyResponseInterceptor implements NestInterceptor {
  constructor(private readonly myLoggerService: MyLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        this.myLoggerService.logger.info('response', {
          responseData: data,
          req: getReqMainInfo(req),
        });
        return {
          code: 0,
          data,
          msg: '成功',
        };
      })
    );
  }
}
