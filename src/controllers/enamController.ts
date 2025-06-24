import { Request, Response } from 'express';
import { AmadeusService } from '../services/enamService';
import aircodes from 'aircodes';
import { sendSuccess, sendError } from '../validators/response.validator';
import { FlightSearchParams, FlightBookParams, FlightCancelParams } from '../../types/enamTypes';

export const AmadeusController = {
  async searchFlights(req: Request, res: Response) {
    try {
      const params: FlightSearchParams = req.body;      
      const userId = req.user?.id || req.user?._id || req.body.userId || req.query.userId;
      const data = await AmadeusService.searchFlights(params, userId);
      return sendSuccess(res, data, 'Flights fetched successfully');
    } catch (error) {
      return sendError(res, error);
    }
  },

  async bookFlight(req: Request, res: Response) {
    try {
      const params: FlightBookParams = req.body;
      const userId = req.user?.id || req.user?._id || req.body.userId || req.query.userId;
      const data = await AmadeusService.bookFlight(params, userId);
      return sendSuccess(res, data, 'Flight booked successfully');
    } catch (error) {
      return sendError(res, error);
    }
  },

  async cancelBooking(req: Request, res: Response) {
    try {
      const params: FlightCancelParams = req.body;
      const userId = req.user?.id || req.user?._id || req.body.userId || req.query.userId;
      const data = await AmadeusService.cancelBooking(params, userId);
      return sendSuccess(res, data, 'Booking cancelled successfully');
    } catch (error) {
      return sendError(res, error);
    }
  },

  async searchLocations(req: Request, res: Response) {
    try {
      const keyword = (req.query.keyword || '').toString().trim();
      if (!keyword) {
        return sendError(res, { isCustom: true, message: 'Missing search keyword' });
      }
      // Search using aircodes (matches IATA code, city, or airport name)
      const results = aircodes.findAirport(keyword);
      // Format for frontend autocomplete
      const formatted = results.map((loc: any) => ({
        label: `${loc.iata} – ${loc.name}${loc.city ? ' / ' + loc.city : ''}${loc.country ? ', ' + loc.country : ''} (${loc.iata})`,
        value: loc.iata,
        type: loc.type,
        country: loc.country || '',
        city: loc.city || '',
        name: loc.name || ''
      }));
      return sendSuccess(res, formatted, 'Locations fetched successfully');
    } catch (error) {
      return sendError(res, error);
    }
  },

  async masterPricerSearch(req: Request, res: Response) {
    try {
      const params: FlightSearchParams = req.body;
      const userId = req.user?.id || req.user?._id || req.body.userId || req.query.userId;
      const data = await AmadeusService.masterPricerSearch(params, userId);
      return sendSuccess(res, data, 'Master Pricer search results fetched successfully');
    } catch (error) {
      return sendError(res, error);
    }
  }
};