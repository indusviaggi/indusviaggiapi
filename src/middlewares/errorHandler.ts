import { Request, Response, NextFunction } from "express";
import { sendError } from "../validators/response.validator";
import logger from "../utils/customLogger";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: "API error",
    method: req.method,
    url: req.originalUrl,
    status: err.status || 500,
    error: err,
    body: req.body,
    query: req.query,
    params: req.params,
    user: req?.user || undefined,
  });
  const status = err.status || 500;
  return sendError(res, err, status);
};