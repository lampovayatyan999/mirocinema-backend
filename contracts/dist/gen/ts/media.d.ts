import { Observable } from "rxjs";
export declare const protobufPackage = "media.v1";
export interface UploadRequest {
    fileName: string;
    folder: string;
    contentType: string;
    data: Uint8Array;
    resizeWidth?: number | undefined;
    resizeHeight?: number | undefined;
}
export interface UploadResponse {
    key: string;
}
export interface GetRequest {
    key: string;
}
export interface GetResponse {
    data: Uint8Array;
    contentType: string;
}
export interface DeleteRequest {
    key: string;
}
export interface DeleteResponse {
    ok: boolean;
}
export declare const MEDIA_V1_PACKAGE_NAME = "media.v1";
export interface MediaServiceClient {
    upload(request: UploadRequest): Observable<UploadResponse>;
    get(request: GetRequest): Observable<GetResponse>;
    delete(request: DeleteRequest): Observable<DeleteResponse>;
}
export interface MediaServiceController {
    upload(request: UploadRequest): Promise<UploadResponse> | Observable<UploadResponse> | UploadResponse;
    get(request: GetRequest): Promise<GetResponse> | Observable<GetResponse> | GetResponse;
    delete(request: DeleteRequest): Promise<DeleteResponse> | Observable<DeleteResponse> | DeleteResponse;
}
export declare function MediaServiceControllerMethods(): (constructor: Function) => void;
export declare const MEDIA_SERVICE_NAME = "MediaService";
