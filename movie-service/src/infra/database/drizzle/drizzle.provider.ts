import { Client } from "pg" 
import type { Provider } from "@nestjs/common"
import { drizzle } from 'drizzle-orm/node-postgres'
import { PG_CONNECTION } from "./connection.provider"

export const DRIZZLE_DB = Symbol('DRIZZLE_DB')

export const drizzleProvider: Provider = {
    provide: DRIZZLE_DB,
    useFactory: (client: Client) => {
        return drizzle(client)
    },
    inject: [PG_CONNECTION]
}