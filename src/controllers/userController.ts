import { userService } from "../services/userService";
import { Request, Response } from "express";
import { Serializer } from "../serializers/serializers";
import { sendSuccess, sendError } from "../validators/response.validator";

export const UserController = {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      sendSuccess(res, users);
    } catch (err: any) {
      sendError(res, err);
    }
  },

  createUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.createUser(req.body);
      sendSuccess(res, user);
    } catch (err: any) {
      sendError(res, err);
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(req.params.id);
      sendSuccess(res, user);
    } catch (err: any) {
      sendError(res, err);
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      sendSuccess(res, user);
    } catch (err: any) {
      sendError(res, err);
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.deleteUser(req.params.id);
      sendSuccess(res, user);
    } catch (err: any) {
      sendError(res, err);
    }
  },
};
