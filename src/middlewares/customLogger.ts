import { Request, Response, NextFunction } from "express";
import logger from "../utils/customLogger";

export const logRequests = (req: Request, res: Response, next: NextFunction) => {
  logger.info({
    message: "Incoming request",
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
    user: req?.user || undefined, // If you attach user info after auth
  });

  // Capture response data
  const oldJson = res.json;
  res.json = function (data) {
    logger.info({
      message: "API response",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      response: data,
    });
    return oldJson.call(this, data);
  };

  next();
};