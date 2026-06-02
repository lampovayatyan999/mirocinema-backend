import { Observable } from "rxjs";
export declare const protobufPackage = "users.v1";
export interface GetMeRequest {
    id: string;
}
export interface GetMeResponse {
    user: User | undefined;
}
export interface CreateUserRequest {
    id: string;
}
export interface CreateUserResponse {
    ok: boolean;
}
export interface PatchUserRequest {
    userId: string;
    name?: string | undefined;
    avatar?: string | undefined;
}
export interface PatchUserResponse {
    ok: boolean;
}
export interface User {
    id: string;
    name?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    avatar?: string | undefined;
}
export declare const USERS_V1_PACKAGE_NAME = "users.v1";
export interface UsersServiceClient {
    getMe(request: GetMeRequest): Observable<GetMeResponse>;
    createUser(request: CreateUserRequest): Observable<CreateUserResponse>;
    patchUser(request: PatchUserRequest): Observable<PatchUserResponse>;
}
export interface UsersServiceController {
    getMe(request: GetMeRequest): Promise<GetMeResponse> | Observable<GetMeResponse> | GetMeResponse;
    createUser(request: CreateUserRequest): Promise<CreateUserResponse> | Observable<CreateUserResponse> | CreateUserResponse;
    patchUser(request: PatchUserRequest): Promise<PatchUserResponse> | Observable<PatchUserResponse> | PatchUserResponse;
}
export declare function UsersServiceControllerMethods(): (constructor: Function) => void;
export declare const USERS_SERVICE_NAME = "UsersService";
