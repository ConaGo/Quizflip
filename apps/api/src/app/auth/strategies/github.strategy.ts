import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL:
        process.env.DOMAIN + ':' + process.env.PORT + '/auth/github/redirect',
      scope: ['user:email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any
  ): Promise<any> {
    const { username, emails, photos, id } = profile;
    const user = {
      socialId: id,
      email: emails[0].value,
      name: username,
      picture: photos[0]?.value,
    };
    return user;
  }
}
