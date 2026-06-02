import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PROTO_PATHS } from '@mirocinema/contracts';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService)

  const url = `${config.getOrThrow('GRPC_HOST')}:${config.getOrThrow('GRPC_PORT')}`

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['theater.v1', 'hall.v1', 'seat.v1'], 
      protoPath: [PROTO_PATHS.THEATER, PROTO_PATHS.HALL, PROTO_PATHS.SEAT],
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
