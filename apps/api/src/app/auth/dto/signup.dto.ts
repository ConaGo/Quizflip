import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import { PasswordValidation, PasswordValidationRequirement } from 'class-validator-password-check';
import { ApiProperty } from '@nestjs/swagger';
const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};
export class SignupDto {
  @ApiProperty({
    example: 'name@provider.com',
    description: 'Unique user-email',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'username',
  })
  @Length(5, 15)
  readonly name: string;

  @ApiProperty({
    example: 'TU762$zert',
    description: 'Password With Lowercase and Uppercase letter, a special character and a number',
  })
  @Validate(PasswordValidation, [passwordRequirement])
  @Length(5)
  readonly password: string;
}
