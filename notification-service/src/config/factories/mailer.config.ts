import type { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export function getMailerConfig(configService: ConfigService): MailerOptions {
    return {
        transport: {
            host: configService.get('smtp.host'),
            port: configService.get('smtp.port'),
            auth: {
                user: configService.get('smtp.username'),
                pass: configService.get('smtp.password')
            },
            secure: configService.get('smtp.secure')
        },
        defaults: {
            from: `MiroCinema ${configService.get('smtp.fromAddress')}`
        }
    }
}