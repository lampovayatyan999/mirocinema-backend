import { registerAs } from "@nestjs/config";
import { validateEnv } from "@/shared/utils/env";
import { RmqValidator} from "../validators";
import { RmqConfig } from "../interfaces/rmq.interface";

export const rmqEnv = registerAs<RmqConfig>('rmq', () => {
    validateEnv(process.env, RmqValidator)

    return {
        url: process.env.RMQ_URL
    }
})