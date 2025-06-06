import express from "express";
import { sendMailController } from "../controllers/mailController";
import { sendMailValidator } from "../validators/mail.validator";
import { validateRequest } from "../middlewares/validateRequest";

const mailRouter = express.Router();

mailRouter.post(
  "/send-mail",
  sendMailValidator,
  validateRequest,
  sendMailController
);

export default mailRouter;