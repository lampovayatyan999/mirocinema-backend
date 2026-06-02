import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";
export declare const protobufPackage = "category.v1";
export interface GetAllCategoriesResponse {
    categories: Category[];
}
export interface Category {
    id: string;
    title: string;
    slug: string;
}
export declare const CATEGORY_V1_PACKAGE_NAME = "category.v1";
export interface CategoryServiceClient {
    getAllCategories(request: Empty): Observable<GetAllCategoriesResponse>;
}
export interface CategoryServiceController {
    getAllCategories(request: Empty): Promise<GetAllCategoriesResponse> | Observable<GetAllCategoriesResponse> | GetAllCategoriesResponse;
}
export declare function CategoryServiceControllerMethods(): (constructor: Function) => void;
export declare const CATEGORY_SERVICE_NAME = "CategoryService";
