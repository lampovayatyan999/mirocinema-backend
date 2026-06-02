import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthClientGrpc } from './auth.grpc';
import { GrpcModule } from '@mirocinema/common';

@Module({
  imports: [
    GrpcModule.register(['AUTH_PACKAGE'])
  ],
  controllers: [AuthController],
  providers: [AuthClientGrpc],
})
export class AuthModule {}
