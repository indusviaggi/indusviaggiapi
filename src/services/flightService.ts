import Flight from "../models/flight";
import mongoose from "mongoose";
import { CustomError } from "../utils/customError";

export const FlightService = {
  getAllFlights: async () => {
    try {
      return await Flight.find();
    } catch (err: any) {
      throw new CustomError(err.message || "Error getting all flights", 500);
    }
  },
  createFlight: async (flight: any) => {
    try {
      const existing = await Flight.findOne({ flightNumber: flight.flightNumber });
      if (existing) {
        throw new CustomError("Flight number must be unique.", 409);
      }
      return await Flight.create(flight);
    } catch (err: any) {
      throw new CustomError(err.message || "Error creating flight", 500);
    }
  },
  getFlightById: async (id: any) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid flight ID format.", 400);
      }
      const flight = await Flight.findById(id);
      if (!flight) {
        throw new CustomError("Flight not found.", 404);
      }
      return flight;
    } catch (err: any) {
      throw new CustomError(err.message || "Error getting flight by ID", 500);
    }
  },
  updateFlight: async (id: any, flight: any) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid flight ID format.", 400);
      }
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
    } catch (err: any) {
      throw new CustomError(err.message || "Error updating flight", 500);
    }
  },
  deleteFlight: async (id: any) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid flight ID format.", 400);
      }
      const deleted = await Flight.findByIdAndDelete(id);
      if (!deleted) {
        throw new CustomError("Flight not found.", 404);
      }
      return deleted;
    } catch (err: any) {
      throw new CustomError(err.message || "Error deleting flight", 500);
    }
  },
};