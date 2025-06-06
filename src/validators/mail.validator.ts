import { body } from "express-validator";

export const sendMailValidator = [
  body("to").exists().isEmail().normalizeEmail(),
  body("subject").exists().trim().escape(),
  body("text").optional().trim().escape(),
  body("html").optional().trim(),
  body("name").optional().trim().escape(),
  body("email").optional().isEmail().normalizeEmail(),
  body("message").optional().trim().escape(),
];