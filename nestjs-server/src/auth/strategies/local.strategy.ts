import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { ValidationError, Validator } from 'class-validator';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly validator: Validator) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const loginDto = new LoginDto(email, password);

    const validationErrors = await this.validator.validate(loginDto);
    if (validationErrors.length > 0) {
      throw new BadRequestException(this.getValidationErrors(validationErrors));
    }

    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private getValidationErrors(errors: ValidationError[]): string[] {
    return errors
      .map((error) => {
        return Object.values(error.constraints);
      })
      .reduce((prev, next) => prev.concat(next));
  }
}
