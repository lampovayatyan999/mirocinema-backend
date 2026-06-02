import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { getMailerConfig } from 'src/config/factories'
import { TemplateService } from './template.service';
@Module({
  imports: [MailerModule.forRootAsync({
    useFactory: getMailerConfig,
    inject: [ConfigService]
  })],
  providers: [MailService, TemplateService],
  exports: [MailService]
})
export class MailModule {}
