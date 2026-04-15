import type { PrismaService } from 'nestjs-prisma';
import type { LoggerOptions } from 'winston';
import * as Transport from 'winston-transport';

export default class DatabaseTransport extends Transport {
  constructor(options: LoggerOptions, private readonly prisma: PrismaService) {
    super(options);
  }
  async log(info: unknown, callback: VoidFunction): Promise<void> {
    const userCount = await this.prisma.user.count();
    console.log('\nstart\n', info, callback, userCount);
  }
}
