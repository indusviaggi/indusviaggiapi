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
      // if there is error then return Error
      if (!errors.isEmpty()) {
        sendError(res, {errors: errors.array()}, 400);
        return;
      }
      const user = req.body;
      if (!user.email || !user.password) {
        sendError(res, {message: 'Username and password are required.'}, 400);
        return;
      }
      const reg_user = await userService.createUser({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      sendSuccess(res, {user: reg_user});
    } catch (err: any) {
      sendError(res, err, 400);
    }
  },

  /* user login */
  loginUser: async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      // if there is error then return Error
      if (!errors.isEmpty()) {
         sendError(res, {errors: errors.array()}, 400);
         return;
      }

      /* check user is exist with our system */
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        sendError(res, {message: "No account is associated with the given email"}, 400);
        return;
      }

      /* compare password */
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        sendError(res, {message: "Invalid Password"}, 400);
        return;
      }
      //create token
      const token = jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || '',
        {
          expiresIn: "1d",
        }
      );
      sendSuccess(res, {token, user});
    } catch (err: any) {
       sendError(res, err);
    }
  },

   /* get user profile logout */
  logoutUser: async (req: profileRequest, res: Response) => {
    const user = await User.findOne({
      email: req.user.email,
    });
    sendSuccess(res, user);
  },

  /* get user profile */
  getUser: async (req: profileRequest, res: Response) => {
    const user = await User.findOne({
      email: req.user.email,
    });
    sendSuccess(res, user);
  },
};
