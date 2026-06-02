import { Global, Module } from '@nestjs/common';
import { DatabaseService, PG } from './database.service';
import { ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from 'src/config/database.config';
import postgres from 'postgres'; 

@Global()
@Module({
  providers: [ 
    {
      provide: PG,
      useFactory: (ConfigService: ConfigService) => {
        const options = getDatabaseConfig(ConfigService)

        return postgres(options)
      },
      inject: [ConfigService]
    },
    DatabaseService],
  exports: [PG, DatabaseService]
})
export class DatabaseModule {}
