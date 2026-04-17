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

  async sendMailToMultiple(
    recipients: string[],
    subject: string,
    html: string
  ) {
    const promises = recipients.map((email) =>
      this.mailerService.sendMail({
        to: email,
        subject,
        html,
      })
    );

    return Promise.all(promises);
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


  async sendUserApprovalEmail(email: string, name: string) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello ${name},</h3>

    <p>
      Your account has been approved by the admin.
    </p>

    <p>
      Please log in to your dashboard to access your account.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'Account Approved', html);
  }


  async sendUserRejectionEmail(email: string, name: string) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello ${name},</h3>

    <p>
      Your account has been rejected by the admin.
    </p>

    <p>
      Please contact the admin for more information.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'Account Rejected', html);
  }

  async sendProjectApprovalEmail(
    email: string,
    projectName: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello,</h3>

    <p>
      Your project "${projectName}" has been approved by the mentor.
    </p>

    <p>
      Please log in to your dashboard to view the feedback and next steps.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'Project Approved', html);
  }

  async sendProjectRejectionEmail(
    email: string,
    projectName: string,
    feedback: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello,</h3>

    <p>
      Your project "${projectName}" has been rejected by the mentor.
    </p>

    <p>
      <strong>Feedback:</strong> ${feedback}
    </p>

    <p>
      Please review the feedback and make the necessary changes.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'Project Rejected', html);
  }

  async sendInternshipApprovalEmail(
    email: string,
    internshipName: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello,</h3>

    <p>
      Your internship "${internshipName}" has been approved by the mentor.
    </p>

    <p>
      Please log in to your dashboard to view the feedback and next steps.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'Internship Approved', html);
  }

  async sendInternshipRejectionEmail(
    email: string,
    internshipName: string,
    feedback: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello,</h3>

    <p>
      Your internship "${internshipName}" has been rejected by the mentor.
    </p>

    <p>
      <strong>Feedback:</strong> ${feedback}
    </p>

    <p>
      Please review the feedback and make the necessary changes.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'Internship Rejected', html);
  }

  async sendNewAssignmentEmail(
    emails: { [email: string]: string }[],
    assignmentName: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello,</h3>

    <p>
      A new assignment "${assignmentName}" has been assigned to you.
    </p>

    <p>
      Please log in to your dashboard to view the assignment details and submit it.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMailToMultiple(emails.map((email) => email.email), 'New Assignment', html);
  }

  async sendAssignmentApprovalEmail(
    email: string,
    assignmentName: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello,</h3>

    <p>
      Your assignment "${assignmentName}" has been approved by the mentor.
    </p>

    <p>
      Please log in to your dashboard to view the feedback and next steps.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'Assignment Approved', html);
  }

  async sendAssignmentRejectionEmail(
    email: string,
    assignmentName: string,
    feedback: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello,</h3>

    <p>
      Your assignment "${assignmentName}" has been rejected by the mentor.
    </p>

    <p>
      <strong>Feedback:</strong> ${feedback}
    </p>

    <p>
      Please review the feedback and make the necessary changes.
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'Assignment Rejected', html);
  }

  async sendJobShortlistedEmail(
    email: string,
    candidateName: string,
    jobTitle: string,
    companyName: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello ${candidateName || 'Candidate'},</h3>

    <p>
      We are pleased to inform you that you have been <strong>shortlisted</strong> for the position of 
      <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
    </p>

    <p>
      Our team was impressed with your profile, and we would like to move forward with the next stage of the selection process.
    </p>

    <p>
      Further details regarding the next steps will be shared with you shortly.
    </p>

    <p>
      Congratulations and best of luck!
    </p>

    <br/>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'You have been shortlisted!', html);
  }

  async sendJobRejectionEmail(
    email: string,
    candidateName: string,
    jobTitle: string,
    companyName: string,
  ) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    
    <h3>Hello ${candidateName || 'Candidate'},</h3>

    <p>
      Thank you for your interest in the <strong>${jobTitle}</strong> position at 
      <strong>${companyName}</strong>.
    </p>

    <p>
      We appreciate the time and effort you invested in your application. 
      After careful consideration, we regret to inform you that you have not been shortlisted for this role.
    </p>

    <p>
      We encourage you to apply for future opportunities that match your skills and experience.
    </p>

    <p>
      We wish you all the best in your job search and future endeavors.
    </p>

    <br/>

    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply.
    </p>

  </div>
  `;

    return this.sendMail(email, 'Application Update', html);
  }

}
