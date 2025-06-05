import Flight from "../models/flight";
import Payment from "../models/payment";

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

export const PaymentService = {
  getAllPayments: async () => {
    return await Payment.find();
  },
  createPayment: async (payment: any) => {
    return await Payment.create(payment);
  },
  getPaymentById: async (id: string) => {
    return await Payment.findById(id);
  },
  updatePayment: async (id: string, payment: any) => {
    return await Payment.findByIdAndUpdate(id, payment, { new: true });
  },
  deletePayment: async (id: string) => {
    return await Payment.findByIdAndDelete(id);
  },
};