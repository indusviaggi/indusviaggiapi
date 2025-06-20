import nodemailer from "nodemailer";
import { CustomError } from "../utils/customError";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const MailService = {
  sendMail: async ({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) => {
    // Optionally, check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new CustomError("Invalid recipient email address.", 400);
    }

    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
      html,
    };

    try {
      return await transporter.sendMail(mailOptions);
    } catch (err: any) {
      throw new CustomError(
        "Failed to send email: " + (err.message || "Unknown error"),
        500,
        err
      );
    }
  },
};