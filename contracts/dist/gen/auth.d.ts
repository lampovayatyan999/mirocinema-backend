import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";
export declare const protobufPackage = "auth.v1";
export interface SendOtpRequest {
    identifier: string;
    type: string;
}
export interface SendOtpResponse {
    ok: boolean;
}
export interface VerifyOtpRequest {
    identifier: string;
    type: string;
    code: string;
}
export interface VerifyOtpResponse {
    accessToken: string;
    refreshToken: string;
}
export interface RefreshRequest {
    refreshToken: string;
}
export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}
export interface TelegramInitResponse {
    url: string;
}
export interface TelegramVerifyRequest {
    query: {
        [key: string]: string;
    };
}
export interface TelegramVerifyRequest_QueryEntry {
    key: string;
    value: string;
}
export interface TelegramVerifyResponse {
    url?: string | undefined;
    acessToken?: string | undefined;
    refreshToken?: string | undefined;
}
export declare const AUTH_V1_PACKAGE_NAME = "auth.v1";
export interface AuthServiceClient {
    sendOtp(request: SendOtpRequest): Observable<SendOtpResponse>;
    verifyOtp(request: VerifyOtpRequest): Observable<VerifyOtpResponse>;
    refresh(request: RefreshRequest): Observable<RefreshResponse>;
    telegramInit(request: Empty): Observable<TelegramInitResponse>;
    telegramVerify(request: TelegramVerifyRequest): Observable<TelegramVerifyResponse>;
}
export interface AuthServiceController {
    sendOtp(request: SendOtpRequest): Promise<SendOtpResponse> | Observable<SendOtpResponse> | SendOtpResponse;
    verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> | Observable<VerifyOtpResponse> | VerifyOtpResponse;
    refresh(request: RefreshRequest): Promise<RefreshResponse> | Observable<RefreshResponse> | RefreshResponse;
    telegramInit(request: Empty): Promise<TelegramInitResponse> | Observable<TelegramInitResponse> | TelegramInitResponse;
    telegramVerify(request: TelegramVerifyRequest): Promise<TelegramVerifyResponse> | Observable<TelegramVerifyResponse> | TelegramVerifyResponse;
}
export declare function AuthServiceControllerMethods(): (constructor: Function) => void;
export declare const AUTH_SERVICE_NAME = "AuthService";
