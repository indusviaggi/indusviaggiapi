import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { userService } from "../services/userService";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Serializer } from "../serializers/serializers";
import { sendSuccess, sendError } from "../validators/response.validator";

interface profileRequest extends Request {
  user?: any;
}

export const AuthController = {
  /* register/create new user */
  registerUser: async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendError(res, {errors: errors.array()}, 400);
      }
      const user = req.body;
      if (!user.email || !user.password) {
        return sendError(res, {message: 'Username and password are required.'}, 400);
      }
      const reg_user = await userService.createUser({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      return sendSuccess(res, {user: reg_user});
    } catch (err: any) {
      return sendError(res, err, 400);
    }
  },

  /* user login */
  loginUser: async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendError(res, {errors: errors.array()}, 400);
      }
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return sendError(res, {message: "No account is associated with the given email"}, 400);
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return sendError(res, {message: "Invalid Password"}, 400);
      }
      const token = jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || '',
        { expiresIn: "1d" }
      );
      return sendSuccess(res, {token, user});
    } catch (err: any) {
      return sendError(res, err);
    }
  },

  /* get user profile logout */
  logoutUser: async (req: profileRequest, res: Response) => {
    const user = await User.findOne({
      email: req.user.email,
    });
    return sendSuccess(res, user);
  },

  /* get user profile */
  getUser: async (req: profileRequest, res: Response) => {
    const user = await User.findOne({
      email: req.user.email,
    });
    return sendSuccess(res, user);
  },
};
