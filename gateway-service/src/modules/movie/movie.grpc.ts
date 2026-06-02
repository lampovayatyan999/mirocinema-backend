import { Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { MovieServiceClient } from "@mirocinema/contracts/gen/ts/movie";


@Injectable()
export class MovieClientGrpc extends AbstractGrpcClient<MovieServiceClient> {
    constructor(@InjectGrpcClient('MOVIE_PACKAGE') client: ClientGrpc) {
        super(client, 'MovieService')
    }
}