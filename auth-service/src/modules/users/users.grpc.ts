import { Inject, Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import type {UsersServiceClient, CreateUserRequest} from '@mirocinema/contracts/gen/ts/users';

@Injectable()
export class UsersClientGrpc implements OnModuleInit {
    private usersService!: UsersServiceClient

    public constructor(@Inject('USERS_PACKAGE') private readonly client: ClientGrpc) {}

    public onModuleInit() {
        this.usersService = this.client.getService<UsersServiceClient>('UsersService')
    }

    public create(request: CreateUserRequest) {
        return this.usersService.createUser(request)
    }
}