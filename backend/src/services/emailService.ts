import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMailSafe(mailOptions: nodemailer.SendMailOptions) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured; skipping email send.');
    return;
  }

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.warn('Email send failed, continuing without it:', error);
  }
}

export async function sendOTP(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'UniBoard OTP Verification',
    html: `
      <h2>Your UniBoard OTP</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>Valid for 10 minutes.</p>
    `,
  };

  return sendMailSafe(mailOptions);
}

export async function sendApprovalEmail(email: string, status: 'approved' | 'rejected', reason?: string) {
  const subject = status === 'approved' ? 'Account Approved - Welcome to UniBoard!' : 'Account Review - UniBoard';
  const html = status === 'approved' ? 
    '<h2>Congratulations! Your provider account is approved.</h2><p>You can now add compounds and buildings.</p>' :
    `<h2>Account ${status.toUpperCase()}</h2><p>Reason: ${reason || 'Documents did not meet verification requirements.'}</p>`;

  return sendMailSafe({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  });
}

export async function sendContactEmail(data: { name: string; email: string; subject: string; message: string }) {
  const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER || 'uniboard.zm@gmail.com';

  return sendMailSafe({
    from: process.env.EMAIL_USER,
    to: adminEmail,
    replyTo: data.email,
    subject: `[UniBoard Contact] ${data.subject}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `,
  });
}
