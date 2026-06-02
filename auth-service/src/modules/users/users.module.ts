import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PROTO_PATHS } from "@mirocinema/contracts"
import { UsersClientGrpc } from './users.grpc';
import type { AllConfigs } from '@/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'USERS_PACKAGE',
        useFactory: (ConfigService: ConfigService<AllConfigs>) => ({
          transport: Transport.GRPC,
          options: {
            package: 'users.v1', 
            protoPath: PROTO_PATHS.USERS,
            url: ConfigService.get('grpc.clients.users', {infer: true}),
          },
        }),
        inject: [ConfigService]
      }
    ])
  ],
  providers: [UsersClientGrpc],
  exports: [UsersClientGrpc],
})
export class UsersModule {}