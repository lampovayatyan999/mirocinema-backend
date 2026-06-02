import { Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { CategoryServiceClient } from "@mirocinema/contracts/gen/ts/category";


@Injectable()
export class CategoryClientGrpc extends AbstractGrpcClient<CategoryServiceClient> {
    constructor(@InjectGrpcClient('CATEGORY_PACKAGE') client: ClientGrpc) {
        super(client, 'CategoryService')
    }
}