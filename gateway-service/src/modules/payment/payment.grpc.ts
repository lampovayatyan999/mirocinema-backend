import { Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { PaymentServiceClient } from "@mirocinema/contracts/gen/ts/payment";


@Injectable()
export class PaymentClientGrpc extends AbstractGrpcClient<PaymentServiceClient> {
    constructor(@InjectGrpcClient('PAYMENT_PACKAGE') client: ClientGrpc) {
        super(client, 'PaymentService')
    }
}