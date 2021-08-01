import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from '@libs/shared-types';
import SocialSignupData, { SocialType } from './dto/user.social.data';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(nameOrEmail: string, password: string): Promise<any> {
    const user = await this.userService.findOneNameOrEmail(nameOrEmail);
    if (user && (await argon2.verify(user.passwordHash, password))) {
      const { passwordHash, id, isActive, ...result } = user;
      return result;
    }
    return null;
  }

  //DEPRECATED
  async signup(signupDto: SignupDto) {
    //REMOVE
    await sleep(1999);
    const user = await this.userService.create(signupDto);
    return user ? user : null;
  }

  //DEPRECATED
  async login(loginDto: LoginDto) {
    //REMOVE
    await sleep(1999);
    const user = await this.userService.findOneNameOrEmail(
      loginDto.nameOrEmail
    );
    return user ? user : null;
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
      console.log(socialSignupData);
      _user = await this.userService.createSocial(socialSignupData);
    }
    return _user;
  }

  async getJwtCookie(payload: TokenPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
export type TokenPayload = {
  name: string;
  sub: number;
};
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
