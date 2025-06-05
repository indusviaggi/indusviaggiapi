import Flight from "../models/flight";
import Passenger from "../models/passenger";

export const PassengerService = {
  getAllPassengers: async () => {
    return await Passenger.find();
  },
  createPassenger: async (passenger: any) => {
    return await Passenger.create(passenger);
  },
  getPassengerById: async (id: string) => {
    return await Passenger.findById(id);
  },
  updatePassenger: async (id: string, passenger: any) => {
    return await Passenger.findByIdAndUpdate(id, passenger, { new: true });
  },
  deletePassenger: async (id: string) => {
    return await Passenger.findByIdAndDelete(id);
  },
};