import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
// import type { Request, Response } from 'express';
import type { Request } from 'express';

import { MyLoggerService } from '../winston-logger/logger';
import { getReqMainInfo } from './get-req-info';

type responseWithMessage = {
  message: string;
};

@Catch(HttpException)
export default class UnifyExceptionFilter implements ExceptionFilter {
  // 注入日志服务相关依赖
  constructor(private readonly myLoggerService: MyLoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp(); // 获取当前执行上下文
    // const res = ctx.getResponse<Response>(); // 获取响应对象
    const req = ctx.getRequest<Request>(); // 获取请求对象
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = exception.getResponse();
    let msg =
      exception.message || (status >= 500 ? 'Service Error' : 'Client Error');
    if (
      Object.prototype.toString.call(response) === '[object Object]' &&
      (response as responseWithMessage).message
    ) {
      msg = (response as responseWithMessage).message;
    }
    // const { query, headers, url, method, body } = req;

    // 记录日志（错误消息，错误码，请求信息等）
    this.myLoggerService.logger.error(msg, {
      status,
      req: getReqMainInfo(req),
      // stack: exception.stack,
    });

    // res.status(status >= 500 ? status : 200).json({ code: 1, msg });
  }
}
