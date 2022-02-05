import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ContainsNumberLetter } from '../../common/decorators/contains-number-letter.decorator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'john@test.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ContainsNumberLetter()
  @ApiProperty({ example: 'changeme1' })
  password: string;
}
