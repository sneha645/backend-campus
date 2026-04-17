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
    const url = `http://localhost:3000/api/auth/verifyEmail?token=${token}`;

    const html = `
      <h2>Welcome 🎉</h2>
      <p>Please verify your email by clicking below:</p>
      <a href="${url}">Verify Email</a>
    `;

    return this.sendMail(email, 'Email Verification', html);
  }

  async sendRecruiterApprovalRequest(email: string, recruiterMail: string) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello Admin,</h3>

    <p>
      A new recruiter has registered on the platform using the email:
      <strong>${recruiterMail}</strong>.
    </p>

    <p>
      Please review and approve the account to grant access.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
`;

    return this.sendMail(email, 'Email Verification', html);
  }

  async sendStudentApprovalRequest(email: string, studentMail: string) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello Admin,</h3>

    <p>
      A new student has registered on the platform using the email:
      <strong>${studentMail}</strong>.
    </p>

    <p>
      Please review and approve the account to grant access.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
`;

    return this.sendMail(email, 'Email Verification', html);
  }

  async sendMentorApprovalRequest(email: string, mentorEmail: string) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello Admin,</h3>

    <p>
      A new mentor has registered on the platform using the email:
      <strong>${mentorEmail}</strong>.
    </p>

    <p>
      Please review and approve the account to grant access.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
`;

    return this.sendMail(email, 'Email Verification', html);
  }

  async sendProjectAssignedMail(
    email: string,
    mentorName: string,
    projectTitle: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello ${mentorName},</h3>

    <p>
      A new project has been assigned to you.
    </p>

    <p>
      <strong>Project Title:</strong> ${projectTitle}
    </p>

    <p>
      Please log in to your dashboard to review the project details and start working on it.
    </p>

    <p>
      Make sure to check deadlines and requirements carefully.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'New Project Assigned', html);
  }

  async sendInternshipAssignedMail(
    email: string,
    mentorName: string,
    internshipTitle: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello ${mentorName},</h3>

    <p>
      A new internship has been assigned to you.
    </p>

    <p>
      <strong>Internship Title:</strong> ${internshipTitle}
    </p>

    <p>
      Please log in to your dashboard to review the project details and start working on it.
    </p>

    <p>
      Make sure to check deadlines and requirements carefully.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'New Project Assigned', html);
  }
}
