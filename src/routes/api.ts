import express, { Request, Response } from "express";
import blogRouter from "./blogRoutes";
import userRouter from "./userRoutes";
import { sendSuccess, sendError } from "../validators/response.validator";

const apiRouter = express.Router();

apiRouter.get("/", (req: Request, res: Response) => {
  sendSuccess(res, { message: "Welcome to your Indus App API." });
});
apiRouter.use("/blogs", blogRouter);
apiRouter.use("/user", userRouter);
export default apiRouter;
