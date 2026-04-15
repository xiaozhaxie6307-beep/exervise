// 此部分注释掉的内容为logger写入数据库的配置

import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'nestjs-prisma';
import type { Logger, LoggerOptions } from 'winston';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

// import DatabaseTransport from './database-transport';

@Injectable()
export class MyLoggerService {
  public logger: Logger;
  public prismaLogger: Logger;

  // constructor(private prisma: PrismaService) {
  constructor() {
    const logTransport = new DailyRotateFile({
      filename: 'logs/%DATE%-info.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    });

    const errorTransport = new DailyRotateFile({
      filename: 'logs/%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    });

    const prismaTransport = new DailyRotateFile({
      filename: 'logs/%DATE%-prisma.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    });

    const prismaErrorTransport = new DailyRotateFile({
      filename: 'logs/%DATE%-prisma-error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    });

    const options: LoggerOptions = {
      level: 'info',
      format: format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [errorTransport, logTransport],
    };
    const prismaOptions: LoggerOptions = {
      level: 'info',
      format: format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [prismaTransport, prismaErrorTransport],
    };
    // 创建Logger对象
    this.logger = createLogger(options);
    this.prismaLogger = createLogger(prismaOptions);
    this.logger.add(
      new transports.Console({
        format: format.simple(),
      })
    );
    this.prismaLogger.add(
      new transports.Console({
        format: format.simple(),
      })
    );

    // this.logger.add(
    //   new DatabaseTransport(
    //     {
    //       format: format.simple(),
    //     },
    //     prisma
    //   )
    // );
  }
}
