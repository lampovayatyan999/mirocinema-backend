import { Inject, Injectable, OnModuleInit } from "@nestjs/common";

import type { ClientGrpc } from "@nestjs/microservices";
import { AccountServiceClient, GetAccountRequest } from "@mirocinema/contracts/gen/ts/account";

@Injectable()
export class AccountClientGrpc implements OnModuleInit {
    private accountService!: AccountServiceClient

    public constructor(@Inject('USERS_PACKAGE') private readonly client: ClientGrpc) {}

    public onModuleInit() {
        this.accountService = this.client.getService<AccountServiceClient>('AccountService')
    }

    public getAccount(request: GetAccountRequest) {
        return this.accountService.getAccount(request)
    }
}