import Amadeus from 'amadeus';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create and export the Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID || '',
  clientSecret: process.env.AMADEUS_CLIENT_SECRET || '',
});

export default amadeus;
