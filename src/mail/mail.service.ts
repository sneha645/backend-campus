import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendMail(to: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to,
            subject,
            html,
        });
    }


    async sendVerificationEmail(email: string, token: string) {
        const url = `http://localhost:3000/user/verify?token=${token}`;

        const html = `
      <h2>Welcome 🎉</h2>
      <p>Please verify your email by clicking below:</p>
      <a href="${url}">Verify Email</a>
    `;

        return this.sendMail(email, 'Email Verification', html);
    }
}