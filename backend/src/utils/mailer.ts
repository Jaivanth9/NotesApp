import nodemailer from "nodemailer";
import { ENV } from "../config/env";

export const sendMail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: ENV.EMAIL_SECURE,
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"OTP Service" <${ENV.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
};
