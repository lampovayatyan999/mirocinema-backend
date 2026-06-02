import { Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { ScreeningServiceClient } from "@mirocinema/contracts/gen/ts/screening";


@Injectable()
export class ScreeningClientGrpc extends AbstractGrpcClient<ScreeningServiceClient> {
    constructor(@InjectGrpcClient('SCREENING_PACKAGE') client: ClientGrpc) {
        super(client, 'ScreeningService')
    }
}