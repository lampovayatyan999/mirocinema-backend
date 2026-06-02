import { Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { AccountServiceClient } from "@mirocinema/contracts/gen/ts/account";


@Injectable()
export class AccountClientGrpc extends AbstractGrpcClient<AccountServiceClient> {
    constructor(@InjectGrpcClient('ACCOUNT_PACKAGE') client: ClientGrpc) {
        super(client, 'AccountService')
    }
}