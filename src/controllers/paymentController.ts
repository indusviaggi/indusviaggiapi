import { Request, Response } from "express";
import { PaymentService } from "../services/paymentService";
import { sendSuccess, sendError } from "../validators/response.validator";

export const PaymentController = {
  getAllPayments: async (req: Request, res: Response) => {
    try {
      const payments = await PaymentService.getAllPayments();
      sendSuccess(res, payments);
    } catch (err) {
      sendError(res, err);
    }
  },
  createPayment: async (req: Request, res: Response) => {
    try {
      const payment = await PaymentService.createPayment(req.body);
      sendSuccess(res, payment);
    } catch (err) {
      sendError(res, err);
    }
  },
  getPaymentById: async (req: Request, res: Response) => {
    try {
      const payment = await PaymentService.getPaymentById(req.params.id);
      sendSuccess(res, payment);
    } catch (err) {
      sendError(res, err);
    }
  },
  updatePayment: async (req: Request, res: Response) => {
    try {
      const payment = await PaymentService.updatePayment(req.params.id, req.body);
      sendSuccess(res, payment);
    } catch (err) {
      sendError(res, err);
    }
  },
  deletePayment: async (req: Request, res: Response) => {
    try {
      const payment = await PaymentService.deletePayment(req.params.id);
      sendSuccess(res, payment);
    } catch (err) {
      sendError(res, err);
    }
  },
};