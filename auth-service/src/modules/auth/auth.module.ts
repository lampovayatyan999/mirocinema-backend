import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { OtpService } from '../otp/otp.service';
import { PassportModule } from '@mirocinema/passport'
import { UserRepository } from '@/shared/repositories';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, UserRepository, OtpService],
})
export class AuthModule {}