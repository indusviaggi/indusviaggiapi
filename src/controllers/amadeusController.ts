import { Request, Response } from 'express';
import { AmadeusService } from '../services/amadeusService';
import { sendSuccess, sendError } from '../validators/response.validator';
import { BookingService } from '../services/bookingService';
import { CustomError } from '../utils/customError';

export const AmadeusController = {
  /**
   * Search for flights
   * @param req Request
   * @param res Response
   */
  searchFlights: async (req: Request, res: Response) => {
    try {
      const flightOffers = await AmadeusService.searchFlights(req.body);
      return sendSuccess(res, flightOffers);
    } catch (err: any) {
      return sendError(res, err);
    }
  },

  /**
   * Search for airports/cities
   * @param req Request
   * @param res Response
   */
  searchLocations: async (req: Request, res: Response) => {
    try {
      const { keyword } = req.query;
      const type = req?.query?.type as string || 'AIRPORT,CITY';
      
      if (!keyword || typeof keyword !== 'string') {
        throw new CustomError('Search keyword is required', 400);
      }
      
      const locations = await AmadeusService.searchLocations(keyword, type);
      return sendSuccess(res, locations);
    } catch (err: any) {
      return sendError(res, err);
    }
  }
};
