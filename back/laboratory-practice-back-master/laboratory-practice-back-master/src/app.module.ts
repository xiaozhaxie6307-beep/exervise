import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
// import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
// import { RequestMethod } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from 'src/auth/auth.module';
import config from 'src/common/configs/config';
// import LoggerMiddleware from 'src/common/middleware/logger.middleware';
import UnifyExceptionFilter from 'src/common/utils/unify-exception.filter';
// import UnifyResponseInterceptor from 'src/common/utils/unify-response.interceptor';
import modules from 'src/modules';

import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { MyLoggerService } from './common/winston-logger/logger';
import { GqlConfigService } from './gql-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: {
          log: [
            {
              emit: 'event',
              level: 'query',
            },
            {
              emit: 'stdout',
              level: 'error',
            },
            {
              emit: 'stdout',
              level: 'info',
            },
            {
              emit: 'stdout',
              level: 'warn',
            },
          ],
        },
      },
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    AuthModule,
    ...modules,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    MyLoggerService,
    {
      provide: APP_FILTER,
      useClass: UnifyExceptionFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: UnifyResponseInterceptor,
    // },
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   // 应用全局中间件
//   configure(consumer: MiddlewareConsumer): void {
//     consumer
//       .apply(LoggerMiddleware)
//       .forRoutes({ path: '*', method: RequestMethod.ALL });
//   }
// }
