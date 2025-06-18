import express from "express";
import { PaymentController } from "../controllers/paymentController";
import { verifyUserToken } from "../middlewares/verifyUserToken";
import { createPaymentValidator } from "../validators/payment.validator";
import { validateRequest } from "../middlewares/validateRequest";

const paymentRouter = express.Router();

paymentRouter
  .route("/")
  .get(verifyUserToken, PaymentController.getAllPayments)
  .post(
    verifyUserToken,
    createPaymentValidator,
    validateRequest,
    PaymentController.createPayment
  );

paymentRouter
  .route("/:id")
  .get(verifyUserToken, PaymentController.getPaymentById)
  .put(
    verifyUserToken,
    createPaymentValidator,
    validateRequest,
    PaymentController.updatePayment
  )
  .delete(verifyUserToken, PaymentController.deletePayment);

export default paymentRouter;