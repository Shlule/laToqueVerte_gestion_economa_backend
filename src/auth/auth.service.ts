import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersService: UserService, 
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({ email, password: hashedPassword });
    
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersService.findOne_by_email(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Générer et retourner un token JWT
      const payload = { email: user.email, sub: user.id };
      return this.jwtService.sign(payload);
    }
    throw new Error('Invalid credentials');
  }
}
