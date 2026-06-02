import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'

import { CategoryClientGrpc } from './category.grpc'

@Controller('categories')
export class CategoryController {
  public constructor(private readonly category: CategoryClientGrpc) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll() {
    const response = await this.category.call('getAllCategories', {})

    return Array.isArray(response.categories)
      ? response.categories
      : response
  }
}