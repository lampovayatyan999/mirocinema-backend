import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'prisma/generated/client';
import { ConfigService } from '@nestjs/config'
import type { AllConfigs } from '@/config';
 
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name)

    public constructor(private readonly configService: ConfigService<AllConfigs>) {
        const adapter = new PrismaPg({
            user: configService.get<string>('database.user', {infer: true}),
            password: configService.get<string>('database.password', {infer: true}),
            host: configService.get<string>('database.host', {infer: true}),
            port: configService.get<number>('database.port', {infer: true}),
            database: configService.get<string>('database.name', {infer: true})
        })

        console.log('DB CONFIG:', {
            user: configService.get('database.user' as any),
            password: configService.get('database.password' as any),
            host: configService.get('database.host' as any),
            port: configService.get('database.port' as any),
            database: configService.get('database.name' as any),
        })

        super({ adapter })
    }

    public async onModuleInit() {
        const start = Date.now()

        this.logger.log('Connecting to database...')

        try {
            await this.$connect()

            const ms = Date.now() - start

            this.logger.log(`Database connection established (time=${ms}ms)`)
        } catch (error) {
            this.logger.error('Failed to connect to database: ', error)

            throw error
        }
    }

    public async onModuleDestroy() {
        this.logger.log('Disconnecting from database...')

        try {
            await this.$disconnect()

            this.logger.log('Database connection closed')
        } catch (error) {
            this.logger.error('Failed to disconnect from database: ', error)
        }
    }
}
