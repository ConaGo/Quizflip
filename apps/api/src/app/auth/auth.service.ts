import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from '@libs/shared-types';
import SocialSignupData, { SocialType } from './dto/user.social.data';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(nameOrEmail: string, password: string): Promise<any> {
    const user = await this.userService.findOneNameOrEmail(nameOrEmail);
    if (user && (await argon2.verify(user.passwordHash, password))) {
      const { passwordHash, id, isActive, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(signupDto: SignupDto) {
    return await this.userService.create(signupDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneNameOrEmail(
      loginDto.nameOrEmail
    );
    return user;
  }

  async socialLoginOrSignup(authType: SocialType, user: any) {
    if (!user) {
      throw new HttpException(
        'Authentication was refused by provider',
        HttpStatus.UNAUTHORIZED
      );
    }
    let _user = await this.userService.findSocial(authType, user.socialId);
    if (!_user) {
      const socialSignupData = new SocialSignupData(authType, user);
      _user = await this.userService.createSocial(socialSignupData);
    }
    return _user;
  }

  async getJwtCookie(user: User): Promise<[string, string, CookieOptions]> {
    const payload: TokenPayload = { name: user.name, sub: user.id };
    const name = 'Authentication';
    const token = this.jwtService.sign(payload);
    const options = {
      maxAge: 60 * 1000 * this.configService.get('JWT_EXPIRATION_MINUTES'),
      httpOnly: true,
      path: '/',
    };
    return [name, token, options];
  }

  async getAndAddJwtRefreshCookie(
    user: User
  ): Promise<[string, string, CookieOptions]> {
    const payload: TokenPayload = { name: user.name, sub: user.id };
    const name = 'Refresh';
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_MINUTES')}m`,
    });
    const options = {
      maxAge:
        60 * 1000 * this.configService.get('JWT_REFRESH_EXPIRATION_MINUTES'),
      httpOnly: true,
      path: '/',
    };
    await this.userService.addRefreshToken(token, user.id);
    return [name, token, options];
  }
  async getLogoutCookie(
    name: string
  ): Promise<[string, string, CookieOptions]> {
    return [name, '', { maxAge: 0, httpOnly: true, path: '/' }];
  }
}
export type TokenPayload = {
  name: string;
  sub: number;
};
export type CookieOptions = { maxAge: number; httpOnly: boolean; path: string };

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
