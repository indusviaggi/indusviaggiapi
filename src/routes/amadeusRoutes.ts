import { Router } from 'express';
import { AmadeusController } from '../controllers/amadeusController';
import { verifyUserToken } from '../middlewares/verifyUserToken';

const router = Router();

// Search for flights
router.post('/flights/search', verifyUserToken, AmadeusController.searchFlights);

// Confirm flight price
router.post('/flights/confirm-price', verifyUserToken, AmadeusController.confirmFlightPrice);

// Create flight booking
router.post('/flights/book', verifyUserToken, AmadeusController.createFlightBooking);

// Get flight booking details
router.get('/flights/booking/:orderId', verifyUserToken, AmadeusController.getFlightBooking);

// Search for airports/cities
router.get('/locations/search', verifyUserToken, AmadeusController.searchLocations);

// Get seat map for a flight
router.post('/flights/seatmap', verifyUserToken, AmadeusController.getSeatMap);

export default router;
