import Flight from "../models/flight";
import Passenger from "../models/passenger";

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