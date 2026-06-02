import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AccountClientGrpc } from 'src/infrastructure/grpc/clients/account.client';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PROTO_PATHS } from '@mirocinema/contracts';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  imports: 
  [TypeOrmModule.forFeature([UserEntity]), 
    ClientsModule.registerAsync([
      {
        name: 'USERS_PACKAGE',
        useFactory: (ConfigService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'account.v1', 
            protoPath: PROTO_PATHS.ACCOUNT,
            url: ConfigService.getOrThrow<string>('AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AccountClientGrpc],
})
export class UsersModule {}
