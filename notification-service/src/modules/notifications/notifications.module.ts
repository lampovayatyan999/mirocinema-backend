import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MailModule } from 'src/infrastructure/mail/mail.module';
import { SmsModule } from 'src/infrastructure/sms/sms.module';
import { getExolveConfig } from 'src/config/factories';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MailModule, SmsModule.registerAsync({
    useFactory: getExolveConfig,
    inject: [ConfigService]
  })],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
