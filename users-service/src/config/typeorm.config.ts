import { ConfigService } from "@nestjs/config"
import type { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { UserEntity } from "src/modules/users/entities/user.entity"

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    return {
        type: 'postgres',
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: configService.getOrThrow<number>('DATABASE_PORT'),
        username: configService.getOrThrow<string>('DATABASE_USERNAME'),
        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
        database: configService.getOrThrow<string>('DATABASE_NAME'),
        entities: [UserEntity],
        synchronize: configService.getOrThrow<string>('DATABASE_SYNC') === 'true',
        logging: configService.getOrThrow<string>('DATABASE_LOGGING') === 'true'
    }
}