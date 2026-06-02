import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
    public constructor(private readonly categoryRepository: CategoryRepository) {}

    public async getAll() {
        const categories = await this.categoryRepository.findAll()

        return {categories}
    }
}
