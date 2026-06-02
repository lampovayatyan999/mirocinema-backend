import { Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { SeatServiceClient } from "@mirocinema/contracts/gen/ts/seat";


@Injectable()
export class SeatClientGrpc extends AbstractGrpcClient<SeatServiceClient> {
    constructor(@InjectGrpcClient('SEAT_PACKAGE') client: ClientGrpc) {
        super(client, 'SeatService')
    }
}