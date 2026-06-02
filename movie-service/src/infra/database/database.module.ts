import { Global, Module } from "@nestjs/common";
import { connectionProvider } from "./drizzle/connection.provider";
import { drizzleProvider } from "./drizzle/drizzle.provider";



@Global()
@Module({
    providers: [
        connectionProvider,
        drizzleProvider
    ],
    exports: [drizzleProvider]
})
export class DatabaseModule {}