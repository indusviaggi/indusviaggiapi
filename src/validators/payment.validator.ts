import { body } from "express-validator";

export const createPaymentValidator = [
  body("booking").exists().isMongoId(),
  body("amount").exists().isNumeric(),
  body("method").exists().isIn(["bonfico", "card", "cash", "other"]),
  body("status").optional().isIn(["pending", "completed", "partial", "failed"]),
  body("transactionId").optional().trim().escape(),
  body("paidAt").optional().isISO8601().toDate(),
];