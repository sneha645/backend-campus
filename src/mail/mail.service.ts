import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/verifyEmail?token=${token}`;

    const html = `
      <h2>Welcome 🎉</h2>
      <p>Please verify your email by clicking below:</p>
      <a href="${url}">Verify Email</a>
    `;

    return this.sendMail(email, 'Email Verification', html);
  }

  async sendAdminApprovalRequest(email: string, token: string) {
    const url = `http://localhost:3000/auth/verifyEmail?token=${token}`;

    const html = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 20px;">
  
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">New Recruiter Registration</h2>
    </div>

    <!-- Body -->
    <div style="padding: 30px; color: #333;">
      
      <h3 style="margin-top: 0;">Hello Admin 👋</h3>
      
      <p style="line-height: 1.6;">
        A new recruiter has registered on the platform and is waiting for your approval.
      </p>

      <p style="line-height: 1.6;">
        Please review the account details and verify their access.
      </p>

      <!-- Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" 
           style="
             background: #2563eb;
             color: #ffffff;
             padding: 12px 25px;
             text-decoration: none;
             border-radius: 6px;
             font-weight: bold;
             display: inline-block;
           ">
           Verify & Approve Recruiter
        </a>
      </div>

      <p style="font-size: 14px; color: #666;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>

      <p style="word-break: break-all; font-size: 13px; color: #2563eb;">
        ${url}
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #888;">
      This is an automated message. Please do not reply.
    </div>

  </div>
</div>
`;

    return this.sendMail(email, 'Email Verification', html);
  }
}
