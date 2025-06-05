import Booking from "../models/booking";
import Flight from "../models/flight";
import User from "../models/user";
import Passenger from "../models/passenger";

export const BookingService = {
  getAllBookings: async () => {
    return await Booking.find().populate("user").populate("flight");
  },
  createBooking: async (booking: any) => {
    return await Booking.create(booking);
  },
  getBookingById: async (id: string) => {
    return await Booking.findById(id).populate("user").populate("flight");
  },
  updateBooking: async (id: string, booking: any) => {
    return await Booking.findByIdAndUpdate(id, booking, { new: true })
      .populate("user")
      .populate("flight");
  },
  deleteBooking: async (id: string) => {
    return await Booking.findByIdAndDelete(id).populate("user").populate("flight");
  },
  getBookingsByUser: async (userId: string) => {
    return await Booking.find({ user: userId }).populate("user").populate("flight");
  },
  getBookingsByFlight: async (flightId: string) => {
    return await Booking.find({ flight: flightId }).populate("user").populate("flight");
  },
  getBookingsByTimeSpan: async (start: Date, end: Date) => {
    return await Booking.find({
      bookedAt: { $gte: start, $lte: end },
    }).populate("user").populate("flight");
  },
  getBookingsByPassenger: async (passengerId: string) => {
    // Find all passenger docs for this passengerId (could also use passportNumber or email)
    const passengers = await Passenger.find({ _id: passengerId });
    if (!passengers.length) {
      const error = new Error("Passenger not found");
      (error as any).isCustom = true;
      (error as any).statusCode = 404;
      throw error;
    }
    // Extract all booking IDs
    const bookingIds = passengers.map((p) => p.booking);
    // Find all bookings with those IDs
    return await Booking.find({ _id: { $in: bookingIds } })
      .populate("user")
      .populate("flight");
  },
};