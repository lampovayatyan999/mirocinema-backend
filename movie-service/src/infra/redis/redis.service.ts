import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config'


@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name)

    public constructor(private readonly configService: ConfigService) {
        super({
            username: configService.get('REDIS_USERNAME'),
            password: configService.get('REDIS_PASSWORD'),
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            // db: parseInt(configService.get('REDIS_DB')),
            lazyConnect: true
        })
    }

    public async onModuleInit() {
        const start = Date.now()

        this.logger.log('Initializing Redis connection...')

        this.on('connect', () => {
            this.logger.log('Redis connecting...')
        })

        this.on('ready', () => {
            const ms = Date.now() - start
            this.logger.log(`Redis connected (time=${ms}ms)`)
        })

        this.on('error', (error) => {
            this.logger.error('Redis error', {
                error: error.message ?? error
            })
        })

        this.on('close', () => {
            this.logger.warn('Redis connection closed')
        })

        this.on('reconnecting', () => {
            this.logger.log('Redis reconnecting...')
        })
    }

    public async onModuleDestroy() {
        this.logger.log('Closing Redis connection...')

        try {
            await this.quit()

            this.logger.log('Redis connection closed')
        } catch (error) {
            this.logger.error('Error closing Redis connection: ', error)
        }
    }

    public async getJson<T>(key: string): Promise<T | null> {
        const value = await this.get(key)

        return value ? (JSON.parse(value) as T) : null
    }

    public async setJson(key: string, value: unknown, ttl?: number) {
        const payload = JSON.stringify(value)

        if(ttl) await this.set(key, payload, 'EX', ttl)
        else await this.set(key, payload)
    }
}
