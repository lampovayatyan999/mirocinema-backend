import { Module } from "@nestjs/common";
import { RmqModule } from './infrastructure/rmq/rmq.module';
import { ConfigModule } from "@nestjs/config";
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { SmsModule } from './infrastructure/sms/sms.module';
import configuration from "./config/configuration";
import validationSchema from "./config/validation.schema";
import { ObservabilityModule } from "./observability/observability.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration],
    expandVariables: true
  }), 
    RmqModule, ObservabilityModule, NotificationsModule, MailModule, SmsModule
  ],
})
export class AppModule {}
