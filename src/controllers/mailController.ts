import { Request, Response } from "express";
import { MailService } from "../services/mailService";
import { sendSuccess, sendError } from "../validators/response.validator";
import { loadTemplate, renderTemplate } from "../emails";

export const sendMailController = async (req: Request, res: Response) => {
  try {
    const { to, subject, text, type } = req.body;
    if (!to || !subject || (!text)) {
      return sendError(res, { message: "Missing required fields." }, 400);
    }
    let html = "Hello, this is a test email.";
    if (type == 'newsletter') {
      const template = loadTemplate("newsletter.html");
      html = renderTemplate(template, {
        name: "Ajay",
      });
    } else if (type == 'booking') {
      const template = loadTemplate("booking.html");
      html = renderTemplate(template, {
        name: "Ajay",
        tripName: "Italy Explorer",
        bookingId: "BK20250601A",
        departureDate: "2025-07-10",
        returnDate: "2025-09-12"
      });
    } else if (type == 'query') {
      const template = loadTemplate("query.html");
      html = renderTemplate(template, {
        name: "Ajay",
        email: "italy@explorer.com",
        subject: "BK20250601A",
        message: "message",
      });
    }
    await MailService.sendMail({ to, subject, text, html });
    sendSuccess(res, {}, "Email sent successfully.");
  } catch (error) {
    sendError(res, error);
  }
};