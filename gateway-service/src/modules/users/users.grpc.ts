import { Injectable } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { UsersServiceClient } from "@mirocinema/contracts/gen/ts/users";

@Injectable()
export class UsersClientGrpc extends AbstractGrpcClient<UsersServiceClient> {
    constructor(@InjectGrpcClient('USERS_PACKAGE') client: ClientGrpc) {
        super(client, 'UsersService')
    }
}