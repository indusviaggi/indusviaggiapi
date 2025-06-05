import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Change as needed
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
    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
      html,
    };
    return transporter.sendMail(mailOptions);
  },
};