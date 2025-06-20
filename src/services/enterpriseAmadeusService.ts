import { CustomError } from '../utils/customError';
import { parseStringPromise } from 'xml2js';
import { getOrCreateSession, closeSession, sendSoapRequest } from '../sessions/enterpriseAmadeusSessionManager';
import { mapAmadeusToBookingOptions } from '../utils/amadeusBookingMapper';

export const EnterpriseAmadeusService = {
  /**
   * Search for flights using Amadeus Enterprise API (XML response, session-aware)
   */
  searchFlights: async (params: any, userId: string) => {
    try {
      // 1. Get or create session
      const sessionId = await getOrCreateSession(userId);
      // 2. Build SOAP/XML request for flight search (placeholder)
      const flightSearchXml = `<FlightSearchRQ><SessionId>${sessionId}</SessionId><From>${params.from}</From><To>${params.to}</To></FlightSearchRQ>`;
      // 3. Send request
      const FLIGHT_SEARCH_ENDPOINT = process.env.AMADEUS_FLIGHT_SEARCH_ENDPOINT || '';
      const xmlResponse = await sendSoapRequest(flightSearchXml, FLIGHT_SEARCH_ENDPOINT);
      // 4. Parse XML to JSON
      const jsonData = await parseStringPromise(xmlResponse, { explicitArray: false });
      // 5. Map to frontend booking options
      if (jsonData.Fare_MasterPricerTravelBoardSearchReply) {
        return mapAmadeusToBookingOptions(jsonData.Fare_MasterPricerTravelBoardSearchReply);
        return [jsonData.Fare_MasterPricerTravelBoardSearchReply];
      } else {
        return [jsonData];
      }
    } catch (err: any) {
      throw new CustomError('Error processing Amadeus Enterprise flight response: ' + err.message, 500);
    }
  },

  /**
   * Search for airports/cities (Enterprise, session-aware)
   */
  searchLocations: async (keyword: string, type: string, userId: string) => {
    try {
      // 1. Get or create session
      const sessionId = await getOrCreateSession(userId);
      // 2. Build SOAP/XML request for location search (placeholder)
      const locationSearchXml = `<LocationSearchRQ><SessionId>${sessionId}</SessionId><Keyword>${keyword}</Keyword><Type>${type}</Type></LocationSearchRQ>`;
      // 3. Send request
      const LOCATION_SEARCH_ENDPOINT = process.env.AMADEUS_LOCATION_SEARCH_ENDPOINT || '';
      const xmlResponse = await sendSoapRequest(locationSearchXml, LOCATION_SEARCH_ENDPOINT);
      // 4. Parse XML to JSON
      const jsonData = await parseStringPromise(xmlResponse, { explicitArray: false });
      // 5. Map to autocomplete format
      const locations = Array.isArray(jsonData.Locations.Location)
        ? jsonData.Locations.Location
        : [jsonData.Locations.Location];
      const formatted = locations.map((loc: any) => ({
        label: `${loc.IATACode} – ${loc.Name}${loc.City ? ' / ' + loc.City : ''}${loc.Country ? ', ' + loc.Country : ''} (${loc.IATACode})`,
        value: loc.IATACode,
        type: loc.Type,
        country: loc.Country || '',
        city: loc.City || '',
        name: loc.Name || ''
      }));
      return formatted;
    } catch (err: any) {
      throw new CustomError('Error processing Amadeus Enterprise location response: ' + err.message, 500);
    }
  },

  /**
   * Close Amadeus session (optional, e.g., after booking)
   */
  closeSession: async (userId: string) => {
    await closeSession(userId);
  }
};
