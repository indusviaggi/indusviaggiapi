import { Request, Response } from "express";
import { BookingService } from "../services/bookingService";
import { sendSuccess, sendError } from "../validators/response.validator";

export const BookingController = {
  getAllBookings: async (req: Request, res: Response) => {
    try {
      const bookings = await BookingService.getAllBookings();
      sendSuccess(res, bookings);
    } catch (err) {
      sendError(res, err);
    }
  },
  createBooking: async (req: Request, res: Response) => {
    try {
      const booking = await BookingService.createBooking(req.body);
      sendSuccess(res, booking);
    } catch (err) {
      sendError(res, err);
    }
  },
  getBookingById: async (req: Request, res: Response) => {
    try {
      const booking = await BookingService.getBookingById(req.params.id);
      sendSuccess(res, booking);
    } catch (err) {
      sendError(res, err);
    }
  },
  updateBooking: async (req: Request, res: Response) => {
    try {
      const booking = await BookingService.updateBooking(req.params.id, req.body);
      sendSuccess(res, booking);
    } catch (err) {
      sendError(res, err);
    }
  },
  deleteBooking: async (req: Request, res: Response) => {
    try {
      const booking = await BookingService.deleteBooking(req.params.id);
      sendSuccess(res, booking);
    } catch (err) {
      sendError(res, err);
    }
  },
};