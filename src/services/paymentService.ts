import Payment from "../models/payment";
import mongoose from "mongoose";
import { CustomError } from "../utils/customError";

export const PaymentService = {
  getAllPayments: async () => {
    try {
      return await Payment.find();
    } catch (err: any) {
      throw new CustomError(err.message || "Error getting all payments", 500);
    }
  },
  createPayment: async (payment: any) => {
    try {
      if (payment.transactionId) {
        const existing = await Payment.findOne({ transactionId: payment.transactionId });
        if (existing) {
          throw new CustomError("Transaction ID must be unique.", 409);
        }
      }
      return await Payment.create(payment);
    } catch (err: any) {
      throw new CustomError(err.message || "Error creating payment", 500);
    }
  },
  getPaymentById: async (id: string) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid payment ID format.", 400);
      }
      const payment = await Payment.findById(id);
      if (!payment) {
        throw new CustomError("Payment not found.", 404);
      }
      return payment;
    } catch (err: any) {
      throw new CustomError(err.message || "Error getting payment by ID", 500);
    }
  },
  updatePayment: async (id: string, payment: any) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid payment ID format.", 400);
      }
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
    } catch (err: any) {
      throw new CustomError(err.message || "Error updating payment", 500);
    }
  },
  deletePayment: async (id: string) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid payment ID format.", 400);
      }
      const deleted = await Payment.findByIdAndDelete(id);
      if (!deleted) {
        throw new CustomError("Payment not found.", 404);
      }
      return deleted;
    } catch (err: any) {
      throw new CustomError(err.message || "Error deleting payment", 500);
    }
  },
};