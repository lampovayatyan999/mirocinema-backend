import { Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { BookingServiceClient } from "@mirocinema/contracts/gen/ts/booking";


@Injectable()
export class BookingClientGrpc extends AbstractGrpcClient<BookingServiceClient> {
    constructor(@InjectGrpcClient('BOOKING_PACKAGE') client: ClientGrpc) {
        super(client, 'BookingService')
    }
}