import express from "express";
import { sendMailController, listNewsletter, unsubscribeNewsletter } from "../controllers/mailController";
import { sendMailValidator } from "../validators/mail.validator";
import { validateRequest } from "../middlewares/validateRequest";

const mailRouter = express.Router();

mailRouter.post(
  "/send-mail",
  sendMailValidator,
  validateRequest,
  sendMailController
);

mailRouter.get("/newsletter", listNewsletter);
mailRouter.delete("/newsletter/:email", unsubscribeNewsletter);

export default mailRouter;