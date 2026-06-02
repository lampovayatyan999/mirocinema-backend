import { Injectable } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { InjectGrpcClient } from "@mirocinema/common";
import { AbstractGrpcClient } from "src/shared/grpc/abstract-grpc.client";
import { MediaServiceClient } from "@mirocinema/contracts/gen/ts/media";

@Injectable()
export class MediaClientGrpc extends AbstractGrpcClient<MediaServiceClient> {
    constructor(@InjectGrpcClient('MEDIA_PACKAGE') client: ClientGrpc) {
        super(client, 'MediaService')
    }
}