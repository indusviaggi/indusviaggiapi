import { Request, Response } from "express";
import { BookingService } from "../services/bookingService";
import { sendSuccess, sendError } from "../validators/response.validator";
import { sendMailController } from "./mailController";

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
        return sendError(res, { message: "Invalid or missing start/end date." }, 400);
      }
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      if (startDate >= endDate) {
        return sendError(res, { message: "Start date must be before end date." }, 400);
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
  createBookingFull: async (req: Request, res: Response) => {
    try {
      const tripType = req.body.flight.ticketType;
      const departureDateRaw = req.body.flight.departureItinerary?.segments?.[0]?.departureTime;
      const returnDateRaw = req.body.flight.returnItinerary?.segments?.[0]?.departureTime;
      const departureDate = departureDateRaw ? new Date(departureDateRaw).toISOString().slice(0, 10) : undefined;
      const returnDate = returnDateRaw ? new Date(returnDateRaw).toISOString().slice(0, 10) : undefined;
      const bookingEmailData = {
        origin: req.body.flight.departureItinerary?.segments?.[0]?.from,
        destination: req.body.flight.departureItinerary?.segments?.[req.body.flight.departureItinerary?.segments?.length-1]?.to,
        departureDate,
        returnDate: tripType === 'round-trip' ? returnDate : undefined,
        tripType,
        adults: req.body.flight.adults,
        children: req.body.flight.children,
        infants: req.body.flight.infants,
        cabinClass: req.body.flight.travelClass,
        contact: req.body.passenger.name + ' ' + req.body.passenger.surname + ' - Price: EUR ' + req.body.flight.price + ' - ' + req.body.passenger.email + " - " + req.body.passenger.phone,
        type: 'agent-booking',
      };
      const mailReq = {
        body: bookingEmailData
      } as Request;
      const mailRes = { json: () => {}, status: () => ({ json: () => {} }) } as unknown as Response;

      const data = { ...req.body, booking: { ...req.body.booking, departureDate, returnDate, user: (req as any).user } };
      const result = await BookingService.createBookingFull(data);

      await sendMailController(mailReq, mailRes);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, err);
    }
  },
  getUserBookingsWithDetails: async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { status = 'all', dateFrom, dateTo, dateType } = req.query;
      const bookings = await BookingService.getUserBookingsWithDetails(user, status as string, dateFrom as string, dateTo as string, dateType as string);
      return sendSuccess(res, bookings);
    } catch (err) {
      return sendError(res, err);
    }
  },
  updateBookingStatus: async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return sendError(res, { status: 400, message: "Status is required." });
    }
    const booking = await BookingService.updateBooking(req.params.id, { status });
    if (!booking) {
      return sendError(res, { status: 404, message: "Booking not found." });
    }
    return sendSuccess(res, { status: booking.status });
  } catch (err) {
    return sendError(res, err);
  }
}};
