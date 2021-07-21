import { Injectable } from '@nestjs/common';
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

  async signup(signupDto: SignupDto) {
    await sleep(1999);
    const user = await this.userService.create(signupDto);

    if (user) {
      return user;
    }
    console.log(user);
    return null;
  }
  async login(loginDto: LoginDto) {
    await sleep(1999);
    const user = await this.userService.findOneNameOrEmail(
      loginDto.nameOrEmail
    );

    const payload = { name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async socialLoginOrSignup(authType: SocialType, user: any) {
    if (!user) {
      return null;
    }
    let _user = await this.userService.findOneNameOrEmail(user.email);
    if (!_user) {
      const socialSignupData = new SocialSignupData(authType, user);
      _user = await this.userService.createSocial(socialSignupData);
    }
    const payload = { name: _user.name, sub: _user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
