import { Request, Response } from 'express';
import { EnterpriseAmadeusService } from '../services/enterpriseAmadeusService';
import { sendSuccess, sendError } from '../validators/response.validator';
import { CustomError } from '../utils/customError';

export const EnterpriseAmadeusController = {
  /**
   * Search for flights (Enterprise)
   */
  searchFlights: async (req: Request, res: Response) => {
    try {
      // Extract userId from req.user (set by authentication middleware)
      const userId = req.user?.id || req.user?._id || req.body.userId || req.query.userId;
      if (!userId) throw new CustomError('User ID not found in request', 401);
      const flightOffers = await EnterpriseAmadeusService.searchFlights(req.body, userId);
      return sendSuccess(res, flightOffers);
    } catch (err: any) {
      return sendError(res, err);
    }
  },

  /**
   * Search for airports/cities (Enterprise)
   */
  searchLocations: async (req: Request, res: Response) => {
    try {
      const { keyword } = req.query;
      const type = req?.query?.type as string || 'AIRPORT,CITY';
      if (!keyword || typeof keyword !== 'string') {
        throw new CustomError('Search keyword is required', 400);
      }
      // Extract userId from req.user (set by authentication middleware)
      const userId = req.user?.id || req.user?._id || req.body.userId || req.query.userId;
      if (!userId) throw new CustomError('User ID not found in request', 401);
      const locations = await EnterpriseAmadeusService.searchLocations(keyword, type, userId);
      return sendSuccess(res, locations);
    } catch (err: any) {
      return sendError(res, err);
    }
  }
};
