import { body } from "express-validator";

export const createBookingValidator = [
  body("user").exists().withMessage("User is required").isMongoId(),
  body("flight").exists().withMessage("Flight is required").isMongoId(),
  body("status").optional().isIn(["booked", "pending", "paid", "cancelled"]),
];