import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { sendError } from '../validators/response.validator';

export const verifyUserToken = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return sendError(res, {isCustom: true, message: "Unauthorized request" }, 401);
  }
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return sendError(res, {isCustom: true, message: "Access denied. No token provided." }, 401);
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = decoded;
    next();
  } catch (err) {
    sendError(res, {isCustom: true, message: "Invalid token." }, 400);
  }
};
