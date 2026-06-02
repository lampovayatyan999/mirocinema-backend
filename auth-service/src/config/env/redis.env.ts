import { registerAs } from "@nestjs/config";
import { validateEnv } from "@/shared/utils/env";
import { RedisValidator} from "../validators";
import { RedisConfig } from "../interfaces/redis.interface";

export const redisEnv = registerAs<RedisConfig>('redis', () => {
    validateEnv(process.env, RedisValidator)

    return {
        user: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        name: process.env.REDIS_NAME,
        db: parseInt(process.env.REDIS_DB)
    }
})