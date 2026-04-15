import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { MyLoggerService } from 'src/common/winston-logger/logger';

// import { Logger } from 'winston';
import { getReqMainInfo } from '../utils/get-req-info';

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  // 注入日志服务相关依赖
  constructor(private readonly myLoggerService: MyLoggerService) {}

  //   use(req: Request, res: Response, next: NextFunction) {
  // 获取请求信息
  // const {
  //   query,
  //   headers: { host },
  //   url,
  //   method,
  //   body,
  // } = req;
  use(req: Request, res: Response, next: NextFunction): void {
    // 记录日志
    this.myLoggerService.logger.info('route', {
      req: getReqMainInfo(req),
    });

    next();
  }
}
