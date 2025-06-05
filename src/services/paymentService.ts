import Flight from "../models/flight";
import Payment from "../models/payment";

export const PaymentService = {
  getAllPayments: async () => {
    return await Payment.find();
  },
  createPayment: async (payment: any) => {
    return await Payment.create(payment);
  },
  getPaymentById: async (id: string) => {
    return await Payment.findById(id);
  },
  updatePayment: async (id: string, payment: any) => {
    return await Payment.findByIdAndUpdate(id, payment, { new: true });
  },
  deletePayment: async (id: string) => {
    return await Payment.findByIdAndDelete(id);
  },
};