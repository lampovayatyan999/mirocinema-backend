import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_DB } from "src/infra/database/drizzle/drizzle.provider";


import type {ListMoviesRequest} from '@mirocinema/contracts/gen/ts/movie'
import { and, eq, gt, isNull, lte, sql, desc, or } from "drizzle-orm";
import { movies } from "src/infra/database/drizzle/schema/movies.schema";
import { categories } from "src/infra/database/drizzle/schema/category.schema";

@Injectable()
export class MovieRepository {
    public constructor(@Inject(DRIZZLE_DB) private readonly db: NodePgDatabase) {}

    public async findAll(filter: ListMoviesRequest) {
        const where = this.buildWhere(filter)
        const orderBy = this.buildOrder(filter)

        const query = this.db.select({
            id: movies.id,
            title: movies.title,
            slug: movies.slug,
            poster: movies.poster,
            ratingAge: movies.ratingAge,
            releaseDate: movies.releaseDate
        }).from(movies).leftJoin(categories, eq(movies.categoryId, categories.id)).where(where).orderBy(orderBy)

        if(filter.limit && filter.limit > 0) return query.limit(filter.limit)

        return query
    }

    public async findBySlug(slug: string) {
        return this.db.select().from(movies).where(eq(movies.slug, slug)).limit(1).then(r => r[0] ?? null)
    }

    public async findById(id: string) {
        return this.db.select().from(movies).where(eq(movies.id, id)).limit(1).then(r => r[0] ?? null)
    }

    private buildWhere(filter: ListMoviesRequest) {
        const now = new Date()

        const conditions = []

        if(!filter.category || filter.category === 'all') {}
        else if(filter.category === 'now') conditions.push(lte(movies.releaseDate, now))
        else if (filter.category === 'soon') conditions.push(or(gt(movies.releaseDate, now), isNull(movies.releaseDate)))
        else conditions.push(eq(categories.slug, filter.category))

        return conditions.length ? and(...conditions) : undefined
    }

    private buildOrder(filter: ListMoviesRequest) {
        if(filter.random) return sql`RANDOM()`

        return desc(movies.releaseDate)
    }
}