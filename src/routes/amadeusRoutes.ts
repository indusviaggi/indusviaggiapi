import { Router } from 'express';
import { AmadeusController } from '../controllers/amadeusController';
import { verifyUserToken } from '../middlewares/verifyUserToken';

const router = Router();

// Search for airports/cities
router.get('/locations/search', AmadeusController.searchLocations);

// Search for flights
router.post('/flights/search', verifyUserToken, AmadeusController.searchFlights);
export default router;
