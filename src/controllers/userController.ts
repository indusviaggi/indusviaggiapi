import { userService } from "../services/userService";
import { Request, Response } from "express";
import { Serializer } from "../serializers/serializers";
import { sendSuccess, sendError } from "../validators/response.validator";

export const UserController = {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      return sendSuccess(res, users);
    } catch (err: any) {
      return sendError(res, err);
    }
  },

  createUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.createUser(req.body);
      return sendSuccess(res, user);
    } catch (err: any) {
      return sendError(res, err);
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(req.params.id);
      return sendSuccess(res, user);
    } catch (err: any) {
      return sendError(res, err);
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      return sendSuccess(res, user);
    } catch (err: any) {
      return sendError(res, err);
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try{
      const user = await userService.deleteUser(req.params.id);
      return sendSuccess(res, user);
    } catch (err: any) {
      return sendError(res, err);
    }
  },
  updateUserPhoto: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      if (!req?.file || !(req?.file as any).location) {
        return sendError(res, { message: "No photo uploaded." }, 400);
      }
      const photoUrl = (req?.file as any).location; // S3 file URL
      const user = await userService.updateUser(userId, { photo: photoUrl });
      return sendSuccess(res, user, "Photo updated.");
    } catch (err) {
      return sendError(res, err);
    }
  },
};
