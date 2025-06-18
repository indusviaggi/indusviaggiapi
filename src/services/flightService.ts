import Flight from "../models/flight";
import mongoose from "mongoose";
import { CustomError } from "../utils/customError";

export const FlightService = {
  getAllFlights: async () => {
    return await Flight.find();
  },
  createFlight: async (flight: any) => {
    // Unique check for flightNumber
    const existing = await Flight.findOne({ flightNumber: flight.flightNumber });
    if (existing) {
      throw new CustomError("Flight number must be unique.", 409);
    }
    // You can add more checks here (e.g., required fields, date logic)
    return await Flight.create(flight);
  },
  getFlightById: async (id: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid flight ID format.", 400);
    }
    const flight = await Flight.findById(id);
    if (!flight) {
      throw new CustomError("Flight not found.", 404);
    }
    return flight;
  },
  updateFlight: async (id: any, flight: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid flight ID format.", 400);
    }
    // Unique check for flightNumber (exclude current flight)
    if (flight.flightNumber) {
      const existing = await Flight.findOne({ 
        flightNumber: flight.flightNumber, 
        _id: { $ne: id }
      });
      if (existing) {
        throw new CustomError("Flight number must be unique.", 409);
      }
    }
    const updated = await Flight.findByIdAndUpdate(id, flight, { new: true });
    if (!updated) {
      throw new CustomError("Flight not found.", 404);
    }
    return updated;
  },
  deleteFlight: async (id: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid flight ID format.", 400);
    }
    const deleted = await Flight.findByIdAndDelete(id);
    if (!deleted) {
      throw new CustomError("Flight not found.", 404);
    }
    return deleted;
  },
};