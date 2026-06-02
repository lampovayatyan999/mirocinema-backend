import { ConfigService } from "@nestjs/config";
import type { StripeOptions } from "nestjs-stripe";

export function getStripeConfig(configService: ConfigService): StripeOptions {
    return {
        apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
        apiVersion: '2020-08-27'
    } as StripeOptions
}