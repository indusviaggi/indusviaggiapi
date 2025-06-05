import express, { Request, Response } from "express";
import userRouter from "./userRoutes";
import flightRouter from "./flightRoutes";
import bookingRouter from "./bookingRoutes";
import passengerRouter from "./passengerRoutes";
import paymentRouter from "./paymentRoutes";
import { sendSuccess, sendError } from "../validators/response.validator";

const apiRouter = express.Router();

apiRouter.get("/", (req: Request, res: Response) => {
  sendSuccess(res, { message: "Welcome to your Indus App API." });
});
apiRouter.use("/user", userRouter);
apiRouter.use("/flights", flightRouter);
apiRouter.use("/bookings", bookingRouter);
apiRouter.use("/passengers", passengerRouter);
apiRouter.use("/payments", paymentRouter);
export default apiRouter;
