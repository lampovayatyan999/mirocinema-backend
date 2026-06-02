import { type DynamicModule, Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import type { SmsAsyncOptions, SmsOptions } from './interfaces';
import {HttpModule} from '@nestjs/axios'
import { SMS_OPTIONS } from './consts';

@Module({})
export class SmsModule {
  public static register(options: SmsOptions): DynamicModule {
    return {
      module: SmsModule,
      imports: [HttpModule],
      providers: [
        SmsService,
        {
          provide: SMS_OPTIONS,
          useValue: options
        }
      ],
      exports: [SmsService]
    }
  }

  public static registerAsync(options: SmsAsyncOptions):DynamicModule {
    return {
      module: SmsModule,
      imports: [HttpModule, ...(options.imports ?? [])],
      providers: [
        SmsService,
        {
          provide: SMS_OPTIONS,
          inject: options.inject ?? [],
          useFactory: options.useFactory
        }
      ],
      exports: [SmsService]
    }
  }
}
