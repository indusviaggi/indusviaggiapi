import { body } from "express-validator";

export const createPassengerValidator = [
  body("booking").exists().isMongoId(),
  body("name").exists().trim().escape(),
  body("dob").exists().isISO8601().toDate(),
  body("gender").exists().isIn(["male", "female", "other"]),
  body("passportNumber").exists().trim().escape(),
  body("phone").optional().trim().escape(),
  body("email").optional().isEmail().normalizeEmail(),
];