import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PROTO_PATHS } from '@mirocinema/contracts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService)

  const url = `${config.getOrThrow('GRPC_HOST')}:${config.getOrThrow('GRPC_PORT')}`

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['booking.v1'], 
      protoPath: [PROTO_PATHS.BOOKING],
      url,
      loader: {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      }
    },
  });

  app.startAllMicroservices()
  app.init()
}
bootstrap();

