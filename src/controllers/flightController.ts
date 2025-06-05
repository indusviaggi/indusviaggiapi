import { Request, Response } from "express";
import { FlightService } from "../services/flightService";
import { sendSuccess, sendError } from "../validators/response.validator";

export const FlightController = {
  getAllFlights: async (req: Request, res: Response) => {
    try {
      const flights = await FlightService.getAllFlights();
      sendSuccess(res, flights);
    } catch (err: any) {
      sendError(res, err);
    }
  },
  createFlight: async (req: Request, res: Response) => {
    try {
      const flight = await FlightService.createFlight(req.body);
      sendSuccess(res, flight);
    } catch (err: any) {
      sendError(res, err);
    }
  },
  getFlightById: async (req: Request, res: Response) => {
    try {
      const flight = await FlightService.getFlightById(req.params.id);
      sendSuccess(res, flight);
    } catch (err: any) {
      sendError(res, err);
    }
  },
  updateFlight: async (req: Request, res: Response) => {
    try {
      const flight = await FlightService.updateFlight(req.params.id, req.body);
      sendSuccess(res, flight);
    } catch (err: any) {
      sendError(res, err);
    }
  },
  deleteFlight: async (req: Request, res: Response) => {
    try {
      const flight = await FlightService.deleteFlight(req.params.id);
      sendSuccess(res, flight);
    } catch (err: any) {
      sendError(res, err);
    }
  },
};