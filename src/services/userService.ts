import User from "../models/user";
import mongoose from "mongoose";
import { CustomError } from "../utils/customError";

export const userService = {
  getAllUsers: async () => {
    return await User.find();
  },

  createUser: async (user: any) => {
    // Unique check for email
    if (user.email) {
      const existing = await User.findOne({ email: user.email });
      if (existing) {
        throw new CustomError("Email must be unique.", 409);
      }
    }
    return await User.create(user);
  },

  getUserById: async (id: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID format.", 400);
    }
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError("User not found.", 404);
    }
    return user;
  },

  updateUser: async (id: any, user: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID format.", 400);
    }
    // Unique check for email (exclude current user)
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
  },

  deleteUser: async (id: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID format.", 400);
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      throw new CustomError("User not found.", 404);
    }
    return deleted;
  },
};
