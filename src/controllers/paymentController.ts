import { Request, Response } from "express";
import { PaymentService } from "../services/paymentService";
import { sendSuccess, sendError } from "../validators/response.validator";

export const PaymentController = {
  getAllPayments: async (req: Request, res: Response) => {
    try {
      const payments = await PaymentService.getAllPayments();
      return sendSuccess(res, payments);
    } catch (err) {
      return sendError(res, err);
    }
  },
  createPayment: async (req: Request, res: Response) => {
    try {
      const payment = await PaymentService.createPayment(req.body);
      return sendSuccess(res, payment);
    } catch (err) {
      return sendError(res, err);
    }
  },
  getPaymentById: async (req: Request, res: Response) => {
    try {
      const payment = await PaymentService.getPaymentById(req.params.id);
      return sendSuccess(res, payment);
    } catch (err) {
      return sendError(res, err);
    }
  },
  updatePayment: async (req: Request, res: Response) => {
    try {
      const payment = await PaymentService.updatePayment(req.params.id, req.body);
      return sendSuccess(res, payment);
    } catch (err) {
      return sendError(res, err);
    }
  },
  deletePayment: async (req: Request, res: Response) => {
    try {
      const payment = await PaymentService.deletePayment(req.params.id);
      return sendSuccess(res, payment);
    } catch (err) {
      return sendError(res, err);
    }
  },
};