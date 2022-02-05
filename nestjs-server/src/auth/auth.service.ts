import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { JWTPayload } from './interfaces/JWTPayload';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (user && (await this.isValidPassword(loginDto.password, user))) {
      return user;
    }

    return null;
  }

  async login(user: User): Promise<TokenDto> {
    const payload: Partial<JWTPayload> = {
      sub: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<TokenDto> {
    const hashedPassword = await hash(registerDto.password, 10);
    const user = await this.userService.create({ ...registerDto, password: hashedPassword });
    if (user) {
      return await this.login(user);
    }

    return null;
  }

  private async isValidPassword(password: string, user: User): Promise<boolean> {
    return await compare(password, user.password);
  }
}
