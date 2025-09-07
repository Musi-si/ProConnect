// utils/email.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure dotenv is loaded
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') }); // adjust path if needed

// Runtime check for credentials
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error('EMAIL_USER or EMAIL_PASS is not defined in .env');
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // Gmail SMTP host
  port: 465,               // SSL port
  secure: true,            // true for 465
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,      // must be Gmail App Password if 2FA enabled
  },
});

// Optional: verify transporter
transporter.verify()
  .then(() => console.log('SMTP transporter ready'))
  .catch((err: unknown) => console.error('SMTP transporter error:', err));

// Function to send email
export const sendEmail = async (to: string, subject: string, htmlOrText: string, isHtml = false) => {
  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    [isHtml ? 'html' : 'text']: htmlOrText, // send html if flag true
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

export default transporter;
