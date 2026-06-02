import type { OtpRequestedEvent, EmailChangedEvent, PhoneChangedEvent } from '@mirocinema/contracts';
import { Injectable } from '@nestjs/common';
import { MailService } from 'src/infrastructure/mail/mail.service';
import { SmsService } from 'src/infrastructure/sms/sms.service';

@Injectable()
export class NotificationsService {
    private readonly SERVICE_NAME!: string

    public constructor(
        private readonly mailService: MailService,
        private readonly smsService: SmsService,
    ) {}

    public async sendOtp(data: OtpRequestedEvent) {
        const { identifier, code, type } = data

        if(type === 'email') await this.mailService.sendOtp(identifier, code)
        else await this.smsService.sendOtp(identifier, code)
    }

    public async emailChanged(data: EmailChangedEvent) {
        const { email, code } = data

        return await this.mailService.sendEmailChange(email, code)
    }

    public async sendPhoneChanged(data: PhoneChangedEvent) {
        const { phone, code } = data

        return await this.smsService.sendPhoneChange(phone, code)
    }

    public async sendEmailChanged(data: EmailChangedEvent) {
        const { email, code } = data

        return await this.mailService.sendEmailChange(email, code)
    }
}