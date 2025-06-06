import Payment from "../models/payment";
import mongoose from "mongoose";
import { CustomError } from "../utils/customError";

export const PaymentService = {
  getAllPayments: async () => {
    return await Payment.find();
  },
  createPayment: async (payment: any) => {
    // Unique check for transactionId
    if (payment.transactionId) {
      const existing = await Payment.findOne({ transactionId: payment.transactionId });
      if (existing) {
        throw new CustomError("Transaction ID must be unique.", 409);
      }
    }
    return await Payment.create(payment);
  },
  getPaymentById: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid payment ID format.", 400);
    }
    const payment = await Payment.findById(id);
    if (!payment) {
      throw new CustomError("Payment not found.", 404);
    }
    return payment;
  },
  updatePayment: async (id: string, payment: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid payment ID format.", 400);
    }
    // Unique check for transactionId (exclude current payment)
    if (payment.transactionId) {
      const existing = await Payment.findOne({
        transactionId: payment.transactionId,
        _id: { $ne: id }
      });
      if (existing) {
        throw new CustomError("Transaction ID must be unique.", 409);
      }
    }
    const updated = await Payment.findByIdAndUpdate(id, payment, { new: true });
    if (!updated) {
      throw new CustomError("Payment not found.", 404);
    }
    return updated;
  },
  deletePayment: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid payment ID format.", 400);
    }
    const deleted = await Payment.findByIdAndDelete(id);
    if (!deleted) {
      throw new CustomError("Payment not found.", 404);
    }
    return deleted;
  },
};