import type { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import type { SmsOptions } from "src/infrastructure/sms/interfaces";

export function getExolveConfig(configService: ConfigService): SmsOptions {
    return {
        apiKey: configService.get('exolve.apiKey') ?? '',
        sender: configService.get('exolve.sender'),
    }
}