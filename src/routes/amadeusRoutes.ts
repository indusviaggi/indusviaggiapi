import { Router } from 'express';
import { AmadeusController } from '../controllers/amadeusController';
import { verifyUserToken } from '../middlewares/verifyUserToken';

const router = Router();

// Search for flights
router.post('/flights/search', verifyUserToken, AmadeusController.searchFlights);

// Search for airports/cities
router.get('/locations/search', verifyUserToken, AmadeusController.searchLocations);

export default router;
