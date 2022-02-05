import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const user = await this.userRepository.save(registerDto);

    return await this.userRepository.findOne(user.id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }
}
