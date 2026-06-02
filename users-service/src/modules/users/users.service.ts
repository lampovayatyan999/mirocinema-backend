import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import type { CreateUserRequest, CreateUserResponse, GetMeRequest, PatchUserRequest } from '@mirocinema/contracts/gen/ts/users';
import { AccountClientGrpc } from 'src/infrastructure/grpc/clients/account.client';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@mirocinema/common';
import { lastValueFrom } from 'rxjs';
import { GetAccountResponse } from '@mirocinema/contracts/dist/gen/account';

@Injectable()
export class UsersService {
    public constructor(private readonly usersRepository: UsersRepository, private readonly accountClient: AccountClientGrpc) {}

    public async getMe(data: GetMeRequest) {
        const { id } = data

        const profile = await this.usersRepository.findById(id)

        if(!profile) throw new RpcException({
            code: RpcStatus.NOT_FOUND,
            details: 'User not found'
        })

        const account = await lastValueFrom<GetAccountResponse>(
            this.accountClient.getAccount({ id })
        );

        return {
            user: {
                id: profile.id,
                name: profile.name ?? '',
                avatar: profile.avatar ?? '',
                phone: account.phone,
                email: account.email
            }
        }
    }

    public async create(data: CreateUserRequest): Promise<CreateUserResponse> {
        const { id } = data

        await this.usersRepository.create({ id });
        return { ok: true };
    }

    public async patchUser(data: PatchUserRequest) {
        const { userId, name, avatar } = data

        const user = await this.usersRepository.findById(userId)

        if(!user) throw new RpcException({code: RpcStatus.NOT_FOUND, details: "Users not found"})

        await this.usersRepository.update(user.id, {
            ...(name !== undefined && {name}),
            ...(avatar !== undefined && { avatar })
        })

        return {ok: true}
    }
}