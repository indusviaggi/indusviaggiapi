import Passenger from "../models/passenger";
import mongoose from "mongoose";
import { CustomError } from "../utils/customError";

export const PassengerService = {
  getAllPassengers: async () => {
    try {
      return await Passenger.find();
    } catch (err: any) {
      throw new CustomError(err.message || "Error getting all passengers", 500);
    }
  },
  createPassenger: async (passenger: any) => {
    try {
      if (passenger.passportNumber) {
        const existing = await Passenger.findOne({ passportNumber: passenger.passportNumber });
        if (existing) {
          throw new CustomError("Passport number must be unique.", 409);
        }
      }
      return await Passenger.create(passenger);
    } catch (err: any) {
      throw new CustomError(err.message || "Error creating passenger", 500);
    }
  },
  getPassengerById: async (id: string) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid passenger ID format.", 400);
      }
      const passenger = await Passenger.findById(id);
      if (!passenger) {
        throw new CustomError("Passenger not found.", 404);
      }
      return passenger;
    } catch (err: any) {
      throw new CustomError(err.message || "Error getting passenger by ID", 500);
    }
  },
  updatePassenger: async (id: string, passenger: any) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid passenger ID format.", 400);
      }
      if (passenger.passportNumber) {
        const existing = await Passenger.findOne({
          passportNumber: passenger.passportNumber,
          _id: { $ne: id }
        });
        if (existing) {
          throw new CustomError("Passport number must be unique.", 409);
        }
      }
      const updated = await Passenger.findByIdAndUpdate(id, passenger, { new: true });
      if (!updated) {
        throw new CustomError("Passenger not found.", 404);
      }
      return updated;
    } catch (err: any) {
      throw new CustomError(err.message || "Error updating passenger", 500);
    }
  },
  deletePassenger: async (id: string) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid passenger ID format.", 400);
      }
      const deleted = await Passenger.findByIdAndDelete(id);
      if (!deleted) {
        throw new CustomError("Passenger not found.", 404);
      }
      return deleted;
    } catch (err: any) {
      throw new CustomError(err.message || "Error deleting passenger", 500);
    }
  },
};