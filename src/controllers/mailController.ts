import { Request, Response } from "express";
import { MailService } from "../services/mailService";
import { sendSuccess, sendError } from "../validators/response.validator";
import { loadTemplate, renderTemplate } from "../emails";

export const sendMailController = async (req: Request, res: Response) => {
  try {
    let { to, type } = req.body;
    if (!type) {
      return sendError(res, { message: "Missing required fields." }, 400);
    }
    let html = "Hello, this is a test email.";
    let subject = "";
    let text = "";
    if (type == 'newsletter') {
      const template = loadTemplate("newsletter.html");
      subject = "Welcome to our Newsletter!";
      text = "Thank you for subscribing to our newsletter.";  
      html = renderTemplate(template, {
        name: to.split('@')[0],
      });
    } else if (type == 'booking') {
      const {
        origin,
        destination,
        departureDate,
        returnDate,
        tripType,
        adults,
        children,
        infants,
        cabinClass,
        contact
      } = req.body;

      const template = loadTemplate("booking.html");
      to = process.env.MAIL_AGENCY;
      subject = "New Booking Query Received";
      text = "Thank you for booking with us. Here are your booking details.";
      html = renderTemplate(template, {
        origin,
        destination,
        departureDate: departureDate,
        returnDate: tripType === 'roundtrip' ? returnDate : 'N/A',
        tripType,
        adults,
        children,
        infants,
        cabinClass,
        contact,
      });
    } else if (type == 'query') {
      const template = loadTemplate("query.html");
      subject = "New Info Query Received";
      text = "Thank you for reaching out to us. We will get back to you shortly.";
      html = renderTemplate(template, {
        name: req?.body.name,
        email: req?.body.to,
        subject: req?.body.subject,
        message: req?.body.message,
      });
    }
    await MailService.sendMail({ to, subject, text, html });
    return sendSuccess(res, {}, "Email sent successfully.");
  } catch (error) {
    return sendError(res, error);
  }
};