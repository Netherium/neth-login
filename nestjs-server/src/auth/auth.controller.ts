import { Body, ClassSerializerInterceptor, Controller, Get, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { TokenDto } from './dto/token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(ThrottlerGuard, LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ type: TokenDto })
  @ApiUnauthorizedResponse()
  @ApiTooManyRequestsResponse()
  async login(@Request() req): Promise<TokenDto> {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @UseGuards(ThrottlerGuard, JwtAuthGuard)
  @ApiOkResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiTooManyRequestsResponse()
  @ApiBearerAuth()
  async getProfile(@Request() req): Promise<User> {
    return req.user;
  }

  @Post('register')
  @UseGuards(ThrottlerGuard)
  @ApiCreatedResponse({ type: TokenDto })
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse()
  @ApiTooManyRequestsResponse()
  async register(@Body() registerDto: RegisterDto): Promise<TokenDto> {
    return this.authService.register(registerDto);
  }
}
