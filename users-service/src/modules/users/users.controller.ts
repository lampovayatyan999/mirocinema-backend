import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import type { CreateUserRequest, CreateUserResponse, GetMeRequest, GetMeResponse, PatchUserRequest, PatchUserResponse } from '@mirocinema/contracts/gen/ts/users';

@Controller()
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'GetMe')
  public async getMe(data: GetMeRequest): Promise<GetMeResponse> {
    return await this.usersService.getMe(data)
  }

  @GrpcMethod('UsersService', 'CreateUser')
  public async create(data: CreateUserRequest): Promise<CreateUserResponse> {
    return await this.usersService.create(data);
  }

  @GrpcMethod('UsersService', 'PatchUser')
  public async patch(data: PatchUserRequest): Promise<PatchUserResponse> {
    return await this.usersService.patchUser(data);
  }
}
