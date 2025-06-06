import { Request, Response } from "express";
import Passenger from "../models/passenger";
import { sendSuccess, sendError } from "../validators/response.validator";
import { PassengerService } from "../services/passengerService";

export const PassengerController = {
  getAllPassengers: async (req: Request, res: Response) => {
    try {
      const passengers = await PassengerService.getAllPassengers();
      return sendSuccess(res, passengers);
    } catch (err) {
      return sendError(res, err);
    }
  },
  createPassenger: async (req: Request, res: Response) => {
    try {
      const passenger = await PassengerService.createPassenger(req.body);
      return sendSuccess(res, passenger);
    } catch (err) {
      return sendError(res, err);
    }
  },
  getPassengerById: async (req: Request, res: Response) => {
    try {
      const passenger = await PassengerService.getPassengerById(req.params.id);
      return sendSuccess(res, passenger);
    } catch (err) {
      return sendError(res, err);
    }
  },
  updatePassenger: async (req: Request, res: Response) => {
    try {
      const passenger = await PassengerService.updatePassenger(req.params.id, req.body);
      return sendSuccess(res, passenger);
    } catch (err) {
      return sendError(res, err);
    }
  },
  deletePassenger: async (req: Request, res: Response) => {
    try {
      const passenger = await PassengerService.deletePassenger(req.params.id);
      return sendSuccess(res, passenger);
    } catch (err) {
      return sendError(res, err);
    }
  },
};