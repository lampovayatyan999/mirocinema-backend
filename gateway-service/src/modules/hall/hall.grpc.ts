import { Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { HallServiceClient } from "@mirocinema/contracts/gen/ts/hall";


@Injectable()
export class HallClientGrpc extends AbstractGrpcClient<HallServiceClient> {
    constructor(@InjectGrpcClient('HALL_PACKAGE') client: ClientGrpc) {
        super(client, 'HallService')
    }
}