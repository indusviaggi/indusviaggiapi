import Booking from "../models/booking";
import Flight from "../models/flight";
import User from "../models/user";
import Passenger from "../models/passenger";
import mongoose from "mongoose";
import { CustomError } from "../utils/customError";

export const BookingService = {
  getAllBookings: async () => {
    return Booking.find().populate("user").populate("flight");
  },
  createBooking: async (booking: any) => {
    // Example: Check if flight exists
    if (!booking.flight || !mongoose.Types.ObjectId.isValid(booking.flight)) {
      throw new CustomError("Invalid or missing flight ID.", 400);
    }
    const flight = await Flight.findById(booking.flight);
    if (!flight) {
      throw new CustomError("Flight not found.", 404);
    }
    // Example: Check if user exists
    if (!booking.user || !mongoose.Types.ObjectId.isValid(booking.user)) {
      throw new CustomError("Invalid or missing user ID.", 400);
    }
    const user = await User.findById(booking.user);
    if (!user) {
      throw new CustomError("User not found.", 404);
    }
    // You can add more business logic checks here (e.g., seat availability)
    return Booking.create(booking);
  },
  getBookingById: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid booking ID format.", 400);
    }
    const booking = await Booking.findById(id).populate("user").populate("flight");
    if (!booking) {
      throw new CustomError("Booking not found.", 404);
    }
    return booking;
  },
  updateBooking: async (id: string, booking: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid booking ID format.", 400);
    }
    // Optional: Check if flight exists if updating flight
    if (booking.flight && !mongoose.Types.ObjectId.isValid(booking.flight)) {
      throw new CustomError("Invalid flight ID.", 400);
    }
    if (booking.flight) {
      const flight = await Flight.findById(booking.flight);
      if (!flight) {
        throw new CustomError("Flight not found.", 404);
      }
    }
    // Optional: Check if user exists if updating user
    if (booking.user && !mongoose.Types.ObjectId.isValid(booking.user)) {
      throw new CustomError("Invalid user ID.", 400);
    }
    if (booking.user) {
      const user = await User.findById(booking.user);
      if (!user) {
        throw new CustomError("User not found.", 404);
      }
    }
    const updated = await Booking.findByIdAndUpdate(id, booking, { new: true })
      .populate("user")
      .populate("flight");
    if (!updated) {
      throw new CustomError("Booking not found.", 404);
    }
    return updated;
  },
  deleteBooking: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid booking ID format.", 400);
    }
    const deleted = await Booking.findByIdAndDelete(id).populate("user").populate("flight");
    if (!deleted) {
      throw new CustomError("Booking not found.", 404);
    }
    return deleted;
  },
  getBookingsByUser: async (userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID format.", 400);
    }
    return await Booking.find({ user: userId }).populate("user").populate("flight");
  },
  getUserBookingsWithDetails: async (user: any, status?: string, dateFrom?: string, dateTo?: string, dateType?: string) => {
    const userId = user._id || user;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID format.", 400);
    }
    
    const query: any = {};
    if (user.role === 'user') {
      query.user = userId;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    // Determine which date field to filter on
    let dateField = 'createdAt';
    if (dateType === 'departure') dateField = 'departureDate';
    else if (dateType === 'arrival') dateField = 'returnDate';
    else if (dateType === 'createdAt') dateField = 'createdAt';
    if (dateFrom || dateTo) {
      query[dateField] = {};
      if (dateFrom) query[dateField].$gte = new Date(dateFrom);
      if (dateTo) query[dateField].$lte = new Date(dateTo);
    }
    const bookings = await Booking.find(query)
      .populate("flight");
    const results = [];
    for (const booking of bookings) {
      const passengers = await Passenger.find({ booking: booking._id });
      results.push({ booking, flight: booking.flight, passengers });
    }
    return results;
  },
  getBookingsByFlight: async (flightId: string) => {
    if (!mongoose.Types.ObjectId.isValid(flightId)) {
      throw new CustomError("Invalid flight ID format.", 400);
    }
    return await Booking.find({ flight: flightId }).populate("user").populate("flight");
  },
  getBookingsByTimeSpan: async (start: Date, end: Date) => {
    return await Booking.find({
      bookedAt: { $gte: start, $lte: end },
    }).populate("user").populate("flight");
  },
  getBookingsByPassenger: async (passengerId: string) => {
    if (!mongoose.Types.ObjectId.isValid(passengerId)) {
      throw new CustomError("Invalid passenger ID format.", 400);
    }
    const passengers = await Passenger.find({ _id: passengerId });
    if (!passengers.length) {
      throw new CustomError("Passenger not found.", 404);
    }
    const bookingIds = passengers.map((p) => p.booking);
    return await Booking.find({ _id: { $in: bookingIds } })
      .populate("user")
      .populate("flight");
  },
  async createBookingFull(data: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { flight, booking, passenger, adults, children, infants, passengerPrices } = data;
      // Merge new info into flight
      const flightData = {
        ...flight,
        adults,
        children,
        infants,
        passengerPrices,
      };
      const newFlight = await Flight.create([flightData], { session });

      const user = await User.findById(booking.user);
      if (!user) {
        throw new CustomError("User not found.", 404);
      }
      // Create booking linked to flight
      const newBooking = await Booking.create([
        { ...booking, flight: newFlight[0]._id }
      ], { session });
      // Create passenger linked to booking
      const newPassenger = await Passenger.create([
        { ...passenger, booking: newBooking[0]._id }
      ], { session });
      await session.commitTransaction();
      session.endSession();
      return {
        flight: newFlight[0],
        booking: newBooking[0],
        passenger: newPassenger[0]
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },
};