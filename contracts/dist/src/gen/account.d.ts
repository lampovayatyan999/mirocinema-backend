import { Observable } from "rxjs";
export declare const protobufPackage = "account.v1";
export declare enum Role {
    USER = 0,
    ADMIN = 1,
    UNRECOGNIZED = -1
}
export interface GetAccountRequest {
    id: string;
}
export interface GetAccountResponse {
    id: string;
    phone: string;
    email: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    role: Role;
}
export interface InitEmailChangeRequest {
    email: string;
    userId: string;
}
export interface InitEmailChangeResponse {
    ok: boolean;
}
export interface ConfirmEmailChangeRequest {
    email: string;
    code: string;
    userId: string;
}
export interface ConfirmEmailChangeResponse {
    ok: boolean;
}
export interface InitPhoneChangeRequest {
    phone: string;
    userId: string;
}
export interface InitPhoneChangeResponse {
    ok: boolean;
}
export interface ConfirmPhoneChangeRequest {
    phone: string;
    code: string;
    userId: string;
}
export interface ConfirmPhoneChangeResponse {
    ok: boolean;
}
export declare const ACCOUNT_V1_PACKAGE_NAME = "account.v1";
export interface AccountServiceClient {
    getAccount(request: GetAccountRequest): Observable<GetAccountResponse>;
    initEmailChange(request: InitEmailChangeRequest): Observable<InitEmailChangeResponse>;
    confirmEmailChange(request: ConfirmEmailChangeRequest): Observable<ConfirmEmailChangeResponse>;
    initPhoneChange(request: InitPhoneChangeRequest): Observable<InitPhoneChangeResponse>;
    confirmPhoneChange(request: ConfirmPhoneChangeRequest): Observable<ConfirmPhoneChangeResponse>;
}
export interface AccountServiceController {
    getAccount(request: GetAccountRequest): Promise<GetAccountResponse> | Observable<GetAccountResponse> | GetAccountResponse;
    initEmailChange(request: InitEmailChangeRequest): Promise<InitEmailChangeResponse> | Observable<InitEmailChangeResponse> | InitEmailChangeResponse;
    confirmEmailChange(request: ConfirmEmailChangeRequest): Promise<ConfirmEmailChangeResponse> | Observable<ConfirmEmailChangeResponse> | ConfirmEmailChangeResponse;
    initPhoneChange(request: InitPhoneChangeRequest): Promise<InitPhoneChangeResponse> | Observable<InitPhoneChangeResponse> | InitPhoneChangeResponse;
    confirmPhoneChange(request: ConfirmPhoneChangeRequest): Promise<ConfirmPhoneChangeResponse> | Observable<ConfirmPhoneChangeResponse> | ConfirmPhoneChangeResponse;
}
export declare function AccountServiceControllerMethods(): (constructor: Function) => void;
export declare const ACCOUNT_SERVICE_NAME = "AccountService";
