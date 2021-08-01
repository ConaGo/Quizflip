import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../auth.service';
import { UserService } from '../../user/user.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log(request?.cookies);
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      //secretOrKey: `${process.env.JWT_SECRET}`,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    console.log('validating', payload.name);
    //return { userId: payload.sub, username: payload.name };
    return this.userService.findOneNameOrEmail(payload.name);
  }
}
