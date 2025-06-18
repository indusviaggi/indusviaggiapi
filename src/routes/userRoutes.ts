import express from "express";
import { AuthController } from "../controllers/authController";
import { UserController } from "../controllers/userController";
import { verifyUserToken } from "../middlewares/verifyUserToken";
import { uploadUserPhoto } from "../middlewares/FilesUploader";
import {
  createUserDataValidator,
  loginUserDataValidator,
} from "../validators/user.validator";

const userRouter = express.Router();

userRouter.post(
  "/register",
  createUserDataValidator,
  AuthController.registerUser
);
userRouter.post("/login", loginUserDataValidator, AuthController.loginUser);
userRouter.get("/logout", verifyUserToken, AuthController.logoutUser);
userRouter.get("/profile", verifyUserToken, AuthController.getUser);
userRouter.get("/list", verifyUserToken, UserController.getAllUsers);
userRouter.put(
  "/:id/photo",
  //uploadUserPhoto.single("photo"),
  UserController.updateUserPhoto
);``
export default userRouter;
