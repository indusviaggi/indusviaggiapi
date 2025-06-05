import Flight from "../models/flight";

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