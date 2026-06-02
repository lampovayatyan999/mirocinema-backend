import { Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { RefundServiceClient } from "@mirocinema/contracts/gen/ts/refund";


@Injectable()
export class RefundClientGrpc extends AbstractGrpcClient<RefundServiceClient> {
    constructor(@InjectGrpcClient('REFUND_PACKAGE') client: ClientGrpc) {
        super(client, 'RefundService')
    }
}