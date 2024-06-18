import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Пароли не совпадают');
    }

    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUser)
      throw new BadRequestException(
        'Пользователь с такой почтой уже зарегистрирован',
      );

    const user = await this.userRepository.save({
      email: createUserDto.email,
      login: createUserDto.login,
      password: await argon2.hash(createUserDto.password),
    });

    const token = this.jwtService.sign({
      email: createUserDto.email,
    });

    return { id: user.id, email: user.email, login: user.login, token };
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
