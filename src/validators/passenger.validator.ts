import { body } from "express-validator";

export const createPassengerValidator = [
  body("booking").exists().isMongoId(),
  body("name").exists().trim().escape(),
  body("surname").exists().trim().escape(),
  body("phone").optional().trim().escape(),
  body("email").optional().isEmail().normalizeEmail(),
];
