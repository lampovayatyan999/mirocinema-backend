import { timestamp } from 'drizzle-orm/pg-core'
import {uuid} from 'drizzle-orm/pg-core'


export const baseColumns = {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}