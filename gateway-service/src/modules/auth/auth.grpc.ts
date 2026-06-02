import { Injectable } from "@nestjs/common";

import type {AuthServiceClient} from '@mirocinema/contracts/gen/ts/auth'
import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";

@Injectable()
export class AuthClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
    constructor(@InjectGrpcClient('AUTH_PACKAGE')  client: ClientGrpc) {
        super(client, 'AuthService')
    }
}