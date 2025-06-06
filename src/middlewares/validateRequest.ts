import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendError } from "../validators/response.validator";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { errors: errors.array() }, 400);  
}
  next();
};