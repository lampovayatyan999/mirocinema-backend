import { Global, Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AccountClientGrpc } from './account.grpc';
import { PROTO_PATHS } from "@mirocinema/contracts"
import { GrpcModule } from '@mirocinema/common';


@Global()
@Module({
  imports: [
    GrpcModule.register(['ACCOUNT_PACKAGE'])
  ],
  controllers: [AccountController],
  providers: [AccountClientGrpc],
  exports: [AccountClientGrpc]
})
export class AccountModule {}
