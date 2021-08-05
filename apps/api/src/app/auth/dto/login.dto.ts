import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'name@provider.com',
    description: 'email or username',
  })
  readonly nameOrEmail: string;

  @ApiProperty({
    example: 'TU762$zert',
  })
  readonly password: string;
}
