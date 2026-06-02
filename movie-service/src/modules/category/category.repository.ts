import { Inject, Injectable } from "@nestjs/common";
import { desc } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_DB } from "src/infra/database/drizzle/drizzle.provider";
import { categories } from "src/infra/database/drizzle/schema/category.schema";


@Injectable()
export class CategoryRepository {
    public constructor(@Inject(DRIZZLE_DB) private readonly db: NodePgDatabase) {}

    public async findAll() {
        return await this.db.select({
            id: categories.id,
            title: categories.id,
            slug: categories.slug
        }).from(categories).orderBy(desc(categories.createdAt))
    }
}