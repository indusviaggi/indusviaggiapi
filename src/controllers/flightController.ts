import { Request, Response } from "express";
import { FlightService } from "../services/flightService";
import { sendSuccess, sendError } from "../validators/response.validator";

export const FlightController = {
  getAllFlights: async (req: Request, res: Response) => {
    try {
      const flights = await FlightService.getAllFlights();
      return sendSuccess(res, flights);
    } catch (err: any) {
      return sendError(res, err);
    }
  },
  createFlight: async (req: Request, res: Response) => {
    try {
      const flight = await FlightService.createFlight(req.body);
      return sendSuccess(res, flight);
    } catch (err: any) {
      return sendError(res, err);
    }
  },
  getFlightById: async (req: Request, res: Response) => {
    try {
      const flight = await FlightService.getFlightById(req.params.id);
      return sendSuccess(res, flight);
    } catch (err: any) {
      return sendError(res, err);
    }
  },
  updateFlight: async (req: Request, res: Response) => {
    try {
      const flight = await FlightService.updateFlight(req.params.id, req.body);
      return sendSuccess(res, flight);
    } catch (err: any) {
      return sendError(res, err);
    }
  },
  deleteFlight: async (req: Request, res: Response) => {
    try {
      const flight = await FlightService.deleteFlight(req.params.id);
      return sendSuccess(res, flight);
    } catch (err: any) {
      return sendError(res, err);
    }
  },
};