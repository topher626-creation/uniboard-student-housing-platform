"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = sendOTP;
exports.sendApprovalEmail = sendApprovalEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
async function sendMailSafe(mailOptions) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured; skipping email send.');
        return;
    }
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.warn('Email send failed, continuing without it:', error);
    }
}
async function sendOTP(email, otp) {
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
async function sendApprovalEmail(email, status, reason) {
    const subject = status === 'approved' ? 'Account Approved - Welcome to UniBoard!' : 'Account Review - UniBoard';
    const html = status === 'approved' ?
        '<h2>Congratulations! Your provider account is approved.</h2><p>You can now add compounds and buildings.</p>' :
        `<h2>Account ${status.toUpperCase()}</h2><p>Reason: ${reason}</p>`;
    return sendMailSafe({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html,
    });
}
//# sourceMappingURL=emailService.js.map