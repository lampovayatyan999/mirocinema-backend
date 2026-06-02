import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport, type MicroserviceOptions } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService)
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ, 
    options: {
      urls: [config.getOrThrow<string>('rmq.url')],
      queue: config.getOrThrow<string>('rmq.queue'),
      queueOptions: {
        durable: true
      },
      noAck: false,
      prefetchCount: 1,
      persistent: true
    }
  })

  await app.startAllMicroservices()
  await app.listen(9102)
}
bootstrap();
