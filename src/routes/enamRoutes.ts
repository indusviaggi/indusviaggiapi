import { Router } from 'express';
import { AmadeusController } from '../controllers/enamController';
import { verifyUserToken } from '../middlewares/verifyUserToken';

const router = Router();

router.post('/flights/search', verifyUserToken, AmadeusController.searchFlights);
router.post('/flights/book', verifyUserToken, AmadeusController.bookFlight);
router.post('/flights/cancel', verifyUserToken, AmadeusController.cancelBooking);
router.get('/locations/search', verifyUserToken, AmadeusController.searchLocations);

export default router;