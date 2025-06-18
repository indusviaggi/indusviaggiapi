import Passenger from "../models/passenger";
import mongoose from "mongoose";
import { CustomError } from "../utils/customError";

export const PassengerService = {
  getAllPassengers: async () => {
    return Passenger.find();
  },
  createPassenger: async (passenger: any) => {
    // Unique check for passportNumber
    if (passenger.passportNumber) {
      const existing = await Passenger.findOne({ passportNumber: passenger.passportNumber });
      if (existing) {
        throw new CustomError("Passport number must be unique.", 409);
      }
    }
    return Passenger.create(passenger);
  },
  getPassengerById: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid passenger ID format.", 400);
    }
    const passenger = await Passenger.findById(id);
    if (!passenger) {
      throw new CustomError("Passenger not found.", 404);
    }
    return passenger;
  },
  updatePassenger: async (id: string, passenger: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid passenger ID format.", 400);
    }
    // Unique check for passportNumber (exclude current passenger)
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
  },
  deletePassenger: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid passenger ID format.", 400);
    }
    const deleted = await Passenger.findByIdAndDelete(id);
    if (!deleted) {
      throw new CustomError("Passenger not found.", 404);
    }
    return deleted;
  },
};