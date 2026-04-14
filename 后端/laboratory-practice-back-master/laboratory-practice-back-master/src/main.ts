import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import type {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from 'src/common/configs/config.interface';
import { MyLoggerService } from 'src/common/winston-logger/logger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  const winstonLogger: MyLoggerService = app.get(MyLoggerService);
  prismaService.$on('query', (event) => {
    winstonLogger.prismaLogger.info('prisma', [
      event.duration,
      event.params,
      event.query,
      event.target,
    ]);
  });
  prismaService.$on('info', (event) => {
    winstonLogger.prismaLogger.info('prisma', [
      event.message,
      event.timestamp,
      event.target,
    ]);
  });
  prismaService.$on('warn', (event) => {
    winstonLogger.prismaLogger.warn('prisma', [
      event.message,
      event.timestamp,
      event.target,
    ]);
  });
  prismaService.$on('error', (event) => {
    winstonLogger.prismaLogger.error('prisma', [
      event.message,
      event.timestamp,
      event.target,
    ]);
  });
  await prismaService.enableShutdownHooks(app);

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  // 此处确定了在app.mudule.ts中引入了config文件，config文件中绝对存在swagger相关配置，所以用!
  if (swaggerConfig!.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig!.title || 'Nestjs')
      .setDescription(
        swaggerConfig!.description || 'The nestjs API description'
      )
      .setVersion(swaggerConfig!.version || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig!.path || 'api', app, document);
  }

  // Cors
  // 此处确定了在app.mudule.ts中引入了config文件，config文件中绝对存在Cors相关配置，所以用!
  if (corsConfig!.enabled) {
    app.enableCors({ origin: '*' });
  }

  await app.listen(process.env.PORT || nestConfig!.port || 3000);
  console.log(
    `服务启动于：http://127.0.0.1:${
      process.env.PORT || nestConfig!.port || 3000
    }`,
    `\nrestfulapi文档：http://127.0.0.1:${
      process.env.PORT || nestConfig!.port || 3000
    }/api`,
    `\ngraphql文档：http://127.0.0.1:${
      process.env.PORT || nestConfig!.port || 3000
    }/graphql`
  );
}
bootstrap();
