import { Request, Response, NextFunction } from "express";
import { sendError } from "../validators/response.validator";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  return sendError(res, err, status);
};