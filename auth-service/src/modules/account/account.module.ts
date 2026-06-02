import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';
import { UserRepository } from '@/shared/repositories';
import { OtpService } from '../otp/otp.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, UserRepository, OtpService],
})
export class AccountModule {}
