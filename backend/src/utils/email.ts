import nodemailer from 'nodemailer';
import { getConfig } from '../config.js';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

declare global {
  // eslint-disable-next-line no-var
  var __smtpTransporter: any | undefined;
}

const getTransporter = async () => {
  // Reuse transporter across warm invocations to reduce overhead.
  if (global.__smtpTransporter) return global.__smtpTransporter;
  const host = await getConfig('smtp_host');
  const port = await getConfig('smtp_port');
  const user = await getConfig('smtp_user');
  const pass = await getConfig('smtp_password');

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    auth: {
      user,
      pass,
    },
  } as SMTPTransport.Options);

  // optional: verify connection on first creation (helps surface config errors early)
  transporter.verify().catch((err:any) => {
    console.warn('SMTP verify failed (this may be normal on cold start):', err.message || err);
  });

  global.__smtpTransporter = transporter;
  return transporter;
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  const from = await getConfig('smtp_from');
  try {
    const transporter = await getTransporter();    
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.log('Failed to send email:', err);
  }
};