export type SocialType = 'google' | 'github';

export type AuthType = SocialType | 'local';

export default class SocialSignupData {
  constructor(
    type: SocialType,
    user: { name: string; email: string; socialId: string; picture?: string }
  ) {
    this.authType = type;
    this.name = user.name;
    this.email = user.email;
    this.socialId = user.socialId;
  }
  readonly authType: SocialType;
  readonly name: string;
  readonly email: string;
  readonly socialId: string;
}
