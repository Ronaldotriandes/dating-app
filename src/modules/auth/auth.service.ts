import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { UserValidation } from './auth.controller';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(userData: UserValidation) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersRepository.save({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return this.generateToken(user);
    }
    return null;
  }

  async validateUser(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }
  private generateToken(user: User) {
    return {
      access_token: this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
        },
        {
          secret: this.configService.get('jwt.secret'),
          expiresIn: this.configService.get('jwt.expiresIn'),
        },
      ),
    };
  }
}
