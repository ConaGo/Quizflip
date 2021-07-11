import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ILoginDto } from '@libs/shared-types';

export class LoginDto implements ILoginDto {
  @ApiProperty({
    example: 'name@provider.com',
    description: 'email or username',
  })
  @IsString()
  readonly nameOrEmail: string;

  @ApiProperty({
    example: 'TU762$zert',
  })
  @IsString()
  readonly password: string;
}
