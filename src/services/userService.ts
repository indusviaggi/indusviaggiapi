import User from "../models/user";
import mongoose from "mongoose";
import { CustomError } from "../utils/customError";

export const userService = {
  getAllUsers: async () => {
    try {
      return await User.find();
    } catch (err: any) {
      throw new CustomError(err.message || "Error getting all users", 500);
    }
  },

  createUser: async (user: any) => {
    try {
      if (user.email) {
        const existing = await User.findOne({ email: user.email });
        if (existing) {
          throw new CustomError("Email must be unique.", 409);
        }
      }
      return await User.create(user);
    } catch (err: any) {
      throw new CustomError(err.message || "Error creating user", 500);
    }
  },

  getUserById: async (id: any) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid user ID format.", 400);
      }
      const user = await User.findById(id);
      if (!user) {
        throw new CustomError("User not found.", 404);
      }
      return user;
    } catch (err: any) {
      throw new CustomError(err.message || "Error getting user by ID", 500);
    }
  },

  updateUser: async (id: any, user: any) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid user ID format.", 400);
      }
      if (user.email) {
        const existing = await User.findOne({
          email: user.email,
          _id: { $ne: id },
        });
        if (existing) {
          throw new CustomError("Email must be unique.", 409);
        }
      }
      const updated = await User.findByIdAndUpdate(id, user, { new: true });
      if (!updated) {
        throw new CustomError("User not found.", 404);
      }
      return updated;
    } catch (err: any) {
      throw new CustomError(err.message || "Error updating user", 500);
    }
  },

  deleteUser: async (id: any) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid user ID format.", 400);
      }
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted) {
        throw new CustomError("User not found.", 404);
      }
      return deleted;
    } catch (err: any) {
      throw new CustomError(err.message || "Error deleting user", 500);
    }
  },
};
