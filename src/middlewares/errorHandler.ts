import { Request, Response, NextFunction } from "express";
import { sendError } from "../validators/response.validator";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  sendError(res, err, status);
};