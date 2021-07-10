import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'username',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'name@provider.com',
    description: 'Unique user-email',
  })
  @IsString()
  readonly email: string;
}
