import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ContainsNumberLetter } from '../../common/decorators/contains-number-letter.decorator';

export class LoginDto {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'john@test.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ContainsNumberLetter()
  @ApiProperty({ example: 'changeme1' })
  password: string;
}
