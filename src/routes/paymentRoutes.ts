import express from "express";
import { PaymentController } from "../controllers/paymentController";
import { verifyUserToken } from "../middlewares/verifyUserToken";

const paymentRouter = express.Router();

paymentRouter
  .route("/")
  .get(verifyUserToken, PaymentController.getAllPayments)
  .post(verifyUserToken, PaymentController.createPayment);

paymentRouter
  .route("/:id")
  .get(verifyUserToken, PaymentController.getPaymentById)
  .put(verifyUserToken, PaymentController.updatePayment)
  .delete(verifyUserToken, PaymentController.deletePayment);

export default paymentRouter;