export type SocialType = 'google' | 'github';

export type AuthType = SocialType | 'local';

export default class SocialSignupData {
  constructor(type: SocialType, user: any) {
    if (type === 'google') {
      this.authType = 'google';
      this.name = user.firstName;
      this.email = user.email;
    }
  }
  readonly authType: SocialType;
  readonly name: string;
  readonly email: string;
}
