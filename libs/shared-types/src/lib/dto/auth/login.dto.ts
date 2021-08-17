export interface ILoginDto {
  nameOrEmail: string;
  password: string;
}
export class LoginDto implements ILoginDto {
  readonly nameOrEmail: string;
  readonly password: string;
}
