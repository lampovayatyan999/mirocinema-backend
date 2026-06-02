import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { GrpcMethod } from '@nestjs/microservices';
import { GetAllCategoriesResponse } from '@mirocinema/contracts/gen/ts/category';

@Controller()
export class CategoryController {
  public constructor(private readonly categoryService: CategoryService) {}

  @GrpcMethod('CategoryService', 'GetAll')
  public async getAll(): Promise<GetAllCategoriesResponse> {
    return await this.categoryService.getAll()
  }
}
