import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SMS_OPTIONS } from './consts';
import type { SendSmsRequest, SendSmsResponse, SmsOptions } from './interfaces';
import { catchError, delay, retryWhen, scan, throwError, timeout, firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    private readonly BASE_URL: string;

    public constructor(
        private readonly httpService: HttpService,
        @Inject(SMS_OPTIONS) private readonly options: SmsOptions
    ) {
        this.BASE_URL = 'https://api.exolve.ru';
    }

    public async sendOtp(phone: string, code: string) {
        return this.send({
            destination: phone,
            text: `Your confirm code: ${code}` 
        })
    }

    public async sendPhoneChange(phone: string, code: string) {
        return this.send({
            destination: phone,
            text: `Phone number change confirm code: ${code}` 
        })
    }

    public send(data: SendSmsRequest):Promise<SendSmsResponse> {
        const payload = {
            number: data.sender ?? this.options.sender,
            destination: data.destination.replace('+', ''),
            text: data.text
        }

        return this.request<SendSmsResponse>('POST', '/messaging/v1/sendSMS', payload)
    }

    private async request<T>(method: 'GET' | 'POST', path: string, body?: any): Promise<T> {
        const url = `${this.BASE_URL}${path}`;

        try {
            const request$ = this.httpService.request<T>({
                method,
                url,
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.options.apiKey}`
                }
            }).pipe(
                timeout(7000),
                retryWhen(errors => errors.pipe(
                    scan((retryCount, error) => {
                        if (retryCount >= 2) throw error;
                        this.logger.warn(`Retry request ${method} ${path}: ${retryCount + 1}/3`);
                        return retryCount + 1;
                    }, 0),
                    delay(500)
                )),
                catchError(error => {
                    const details = error.response?.data ?? error.message ?? error;

                    this.logger.error(
                        `Exolve API error (${method} ${path})\n${JSON.stringify(details)}`
                    );

                    return throwError(() => error);
                })
            );

            const response = await firstValueFrom(request$);
            return response.data;

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Request failed (${method} ${path}): ${errorMessage}`);
            throw error;
        }
    }
}