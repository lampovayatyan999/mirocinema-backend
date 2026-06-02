import { ConfigService } from "@nestjs/config";
import type { AllConfigs } from "../interfaces";
import { PassportOptions } from "@mirocinema/passport";

export function getPassportConfig(configService: ConfigService<AllConfigs>):PassportOptions {
    return {
        secretKey: configService.get('passport.secretKey', {infer: true})
    }
}