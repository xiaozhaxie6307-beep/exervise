import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import type { SecurityConfig } from 'src/common/configs/config.interface';
import { v4 as uuidv4 } from 'uuid';

import type { SignupInput } from './dto/signup.input';
import type { Token } from './models/token.model';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    const { realname, ...restPayload } = payload;
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          ...restPayload,
          realname: realname?.trim() || payload.username,
          uuid: uuidv4(),
          password: hashedPassword,
          role: 'USER',
        },
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`用户名${payload.username}已存在！`);
      }
      throw new Error((e as Error).message);
    }
  }

  async login(username: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new HttpException(
        { message: '用户名不存在！请重新输入！' },
        HttpStatus.BAD_REQUEST
      );
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new HttpException(
        { message: '密码校验失败！请重新输入！' },
        HttpStatus.BAD_REQUEST
      );
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    }) as Promise<User>;
  }

  getUserFromToken(token: string): Promise<User> {
    const getToken = this.jwtService.decode(token) as { [key: string]: number };
    if (getToken !== null && 'userId' in getToken) {
      const id = getToken['userId'];
      return this.prisma.user.findUnique({ where: { id } }) as Promise<User>;
    } else throw new UnauthorizedException();
  }

  generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: number }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig!.refreshIn,
      // expiresIn: 20,
    });
  }

  refreshToken(token: string): Token {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
