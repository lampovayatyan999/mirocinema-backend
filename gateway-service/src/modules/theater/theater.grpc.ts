import { Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { TheaterServiceClient } from "@mirocinema/contracts/gen/ts/theater";


@Injectable()
export class TheaterClientGrpc extends AbstractGrpcClient<TheaterServiceClient> {
    constructor(@InjectGrpcClient('THEATER_PACKAGE') client: ClientGrpc) {
        super(client, 'TheaterService')
    }
}