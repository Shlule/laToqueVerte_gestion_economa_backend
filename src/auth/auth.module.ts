import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { config as dotenvConfig } from 'dotenv';
import { User } from '../user/user.entity';
import { PassportModule } from '@nestjs/passport';

dotenvConfig()

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    PassportModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}