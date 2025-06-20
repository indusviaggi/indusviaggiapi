import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { sendError } from '../validators/response.validator';

export const verifyUserToken = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return sendError(res, { message: "Unauthorized request" }, 401);
  }
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return sendError(res, { message: "Access denied. No token provided." }, 401);
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = decoded;
    next();
  } catch (err) {
    sendError(res, { message: "Invalid token." }, 400);
  }
};
