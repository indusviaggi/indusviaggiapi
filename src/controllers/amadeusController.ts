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
   * Confirm flight price
   * @param req Request
   * @param res Response
   */
  confirmFlightPrice: async (req: Request, res: Response) => {
    try {
      const { flightOffer } = req.body;
      if (!flightOffer) {
        throw new CustomError('Flight offer is required', 400);
      }
      
      const pricedOffer = await AmadeusService.confirmFlightPrice(flightOffer);
      return sendSuccess(res, pricedOffer);
    } catch (err: any) {
      return sendError(res, err);
    }
  },

  /**
   * Create flight booking
   * @param req Request
   * @param res Response
   */
  createFlightBooking: async (req: Request, res: Response) => {
    try {
      const { flightOffer, travelers, contacts } = req.body;
      
      if (!flightOffer) {
        throw new CustomError('Flight offer is required', 400);
      }
      
      if (!travelers || !Array.isArray(travelers) || travelers.length === 0) {
        throw new CustomError('Travelers information is required', 400);
      }
      
      if (!contacts) {
        throw new CustomError('Contact information is required', 400);
      }
      
      // Create flight order in Amadeus
      const flightOrder = await AmadeusService.createFlightOrder(flightOffer, travelers, contacts);
      
      // Extract relevant information for our database
      const bookingData = {
        user: req.body.userId, // Assuming userId is passed in the request
        flight: req.body.flightId, // Assuming flightId is passed or created
        seats: req.body.seats || [],
        totalPrice: flightOffer.price ? flightOffer.price.total : 0,
        status: 'booked',
        amadeusBookingId: flightOrder.id,
        amadeusBookingData: flightOrder
      };
      
      // Save booking in our database
      const booking = await BookingService.createBooking(bookingData);
      
      return sendSuccess(res, {
        booking,
        flightOrder
      });
    } catch (err: any) {
      return sendError(res, err);
    }
  },

  /**
   * Get flight booking details
   * @param req Request
   * @param res Response
   */
  getFlightBooking: async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      
      if (!orderId) {
        throw new CustomError('Order ID is required', 400);
      }
      
      const flightOrder = await AmadeusService.getFlightOrder(orderId);
      return sendSuccess(res, flightOrder);
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
      
      if (!keyword || typeof keyword !== 'string') {
        throw new CustomError('Search keyword is required', 400);
      }
      
      const locations = await AmadeusService.searchLocations(keyword);
      return sendSuccess(res, locations);
    } catch (err: any) {
      return sendError(res, err);
    }
  },

  /**
   * Get seat map for a flight
   * @param req Request
   * @param res Response
   */
  getSeatMap: async (req: Request, res: Response) => {
    try {
      const { flightOffer } = req.body;
      
      if (!flightOffer) {
        throw new CustomError('Flight offer is required', 400);
      }
      
      const seatMap = await AmadeusService.getSeatMap(flightOffer);
      return sendSuccess(res, seatMap);
    } catch (err: any) {
      return sendError(res, err);
    }
  }
};
