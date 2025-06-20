import { Router } from 'express';
import { EnterpriseAmadeusController } from '../controllers/enterpriseAmadeusController';
import { verifyUserToken } from '../middlewares/verifyUserToken';

const router = Router();

// Search for airports/cities (Enterprise)
router.get('/locations/search', EnterpriseAmadeusController.searchLocations);

// Search for flights (Enterprise)
router.post('/flights/search', verifyUserToken, EnterpriseAmadeusController.searchFlights);

export default router;
