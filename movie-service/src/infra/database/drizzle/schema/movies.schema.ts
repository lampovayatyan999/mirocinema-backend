import { pgTable, varchar, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "./common.schema";
import { categories } from "./category.schema";
import { relations } from "drizzle-orm";


export const movies = pgTable('movies', {
    ...baseColumns,
    title: varchar('title', {length: 255}).notNull(),
    slug: varchar('slug', {length: 255}).unique(),
    description: text('description').notNull(),
    poster: text('poster').notNull(),
    banner: text('banner'),
    duration: integer('duration').default(0).notNull(),
    releaseYear: integer('release_year'),
    releaseDate: timestamp('release_data'),
    ratingAge: integer('rating_age').default(0),
    country: varchar('country', {length: 255}),
    categoryId: uuid('category_id').references(
        () => categories.id,
        { onDelete: 'cascade' }
    )
})

export const moviesRelations = relations(movies, ({one}) => ({
    category: one(categories, {
        fields: [movies.categoryId],
        references: [categories.id]
    })
}))