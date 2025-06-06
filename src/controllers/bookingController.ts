import { Request, Response } from "express";
import { BookingService } from "../services/bookingService";
import { sendSuccess, sendError } from "../validators/response.validator";

export const BookingController = {
  getAllBookings: async (req: Request, res: Response) => {
    try {
      const bookings = await BookingService.getAllBookings();
      return sendSuccess(res, bookings);
    } catch (err) {
      return sendError(res, err);
    }
  },
  createBooking: async (req: Request, res: Response) => {
    try {
      const booking = await BookingService.createBooking(req.body);
      return sendSuccess(res, booking);
    } catch (err) {
      return sendError(res, err);
    }
  },
  getBookingById: async (req: Request, res: Response) => {
    try {
      const booking = await BookingService.getBookingById(req.params.id);
      return sendSuccess(res, booking);
    } catch (err) {
      return sendError(res, err);
    }
  },
  updateBooking: async (req: Request, res: Response) => {
    try {
      const booking = await BookingService.updateBooking(req.params.id, req.body);
      return sendSuccess(res, booking);
    } catch (err) {
      return sendError(res, err);
    }
  },
  deleteBooking: async (req: Request, res: Response) => {
    try {
      const booking = await BookingService.deleteBooking(req.params.id);
      return sendSuccess(res, booking);
    } catch (err) {
      return sendError(res, err);
    }
  },
  getBookingsByUser: async (req: Request, res: Response) => {
    try {
      const bookings = await BookingService.getBookingsByUser(req.params.userId);
      return sendSuccess(res, bookings);
    } catch (err) {
      return sendError(res, err);
    }
  },
  getBookingsByFlight: async (req: Request, res: Response) => {
    try {
      const bookings = await BookingService.getBookingsByFlight(req.params.flightId);
      return sendSuccess(res, bookings);
    } catch (err) {
      return sendError(res, err);
    }
  },
  getBookingsByTimeSpan: async (req: Request, res: Response) => {
    try {
      const { start, end } = req.query;
      if (!start || !end || isNaN(Date.parse(start as string)) || isNaN(Date.parse(end as string))) {
        return res.status(400).json({ success: false, message: "Invalid or missing start/end date." });
      }
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      if (startDate >= endDate) {
        return res.status(400).json({ success: false, message: "Start date must be before end date." });
      }
      const bookings = await BookingService.getBookingsByTimeSpan(startDate, endDate);
      return sendSuccess(res, bookings);
    } catch (err) {
      return sendError(res, err);
    }
  },
  getBookingsByPassenger: async (req: Request, res: Response) => {
    try {
      const bookings = await BookingService.getBookingsByPassenger(req.params.passengerId);
      return sendSuccess(res, bookings);
    } catch (err) {
      return sendError(res, err);
    }
  },
};