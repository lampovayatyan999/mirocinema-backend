import { Global, Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import type { AllConfigs } from '@/config';


@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATIONS_CLIENT',
        useFactory: (configService: ConfigService<AllConfigs>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rmq.url', {infer: true})],
            queue: 'notifications_queue',
            queueOptions: {
              durable: true
            }
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  providers: [MessagingService],
  exports: [MessagingService]
})
export class MessagingModule {}
