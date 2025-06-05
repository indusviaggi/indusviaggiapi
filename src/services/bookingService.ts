import Booking from "../models/booking";
import Flight from "../models/flight";

export const BookingService = {
  getAllBookings: async () => {
    return await Booking.find();
  },
  createBooking: async (booking: any) => {
    return await Booking.create(booking);
  },
  getBookingById: async (id: string) => {
    return await Booking.findById(id);
  },
  updateBooking: async (id: string, booking: any) => {
    return await Booking.findByIdAndUpdate(id, booking, { new: true });
  },
  deleteBooking: async (id: string) => {
    return await Booking.findByIdAndDelete(id);
  },
};

export const FlightService = {
  getAllFlights: async () => {
    return await Flight.find();
  },
  createFlight: async (flight: any) => {
    return await Flight.create(flight);
  },
  getFlightById: async (id: any) => {
    return await Flight.findById(id);
  },
  updateFlight: async (id: any, flight: any) => {
    return await Flight.findByIdAndUpdate(id, flight, { new: true });
  },
  deleteFlight: async (id: any) => {
    return await Flight.findByIdAndDelete(id);
  },
};