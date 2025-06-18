import { body } from "express-validator";

export const sendMailValidator = [
  body("to").optional().isEmail().normalizeEmail(),
  body("type").exists().trim().escape(),
  body("name").optional().trim().escape(),
  body("subject").optional().trim().escape(),
  body("message").optional().trim().escape(),
  body("email").optional().trim().escape(),
  body("message1").optional().trim().escape(),
];