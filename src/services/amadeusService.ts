import amadeus from '../configs/amadeus';
import { CustomError } from '../utils/customError';

export const AmadeusService = {
  /**
   * Search for flights using Amadeus Flight Offers Search API
   * @param params Search parameters
   * @returns Formatted flight offers (detailed, sorted by price, with airline names)
   */
  searchFlights: async (params: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children?: number;
    infants?: number;
    travelClass?: string;
    currencyCode?: string;
    maxPrice?: number;
    max?: number;
  }) => {
    try {
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        adults: params.adults,
        children: params.children,
        infants: params.infants,
        travelClass: params.travelClass,
        currencyCode: params.currencyCode || 'EUR',
        maxPrice: params.maxPrice,
        max: params.max || 20
      });
      // Get all unique carrier codes from the offers
      const carrierCodes = new Set();
      for (const offer of response.data) {
        for (const itin of offer.itineraries) {
          for (const seg of itin.segments) {
            carrierCodes.add(seg.carrierCode);
          }
        }
      }
      // Fetch airline names from Amadeus
      const airlineNames = await AmadeusService.getAirlineNames(Array.from(carrierCodes) as string[]);
      return AmadeusService._formatFlightOffersDetailedInternal(response.data, airlineNames);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        throw new CustomError(error.response.data.errors[0].detail, error.response.statusCode || 500);
      }
      throw new CustomError('Error searching flights - ' + JSON.stringify(error), 500);
    }
  },

  /**
   * Fetch full airline names for a list of carrier codes using Amadeus API
   */
  getAirlineNames: async (codes: string[]): Promise<Record<string, string>> => {
    if (!codes.length) return {};
    try {
      const response = await amadeus.referenceData.airlines.get({
        airlineCodes: codes.join(',')
      });
      // Map IATA code to full name
      const map: Record<string, string> = {};
      for (const airline of response.data) {
        map[airline.iataCode] = airline.businessName || airline.commonName || airline.name || airline.iataCode;
      }
      return map;
    } catch (error: any) {
      // If lookup fails, just return empty map (fallback to code)
      return {};
    }
  },

  /**
   * Internal: Format flight offers for detailed display (airline, times, layovers, baggage, etc.)
   * @param flightOffers Raw flight offers array
   * @param airlineNames Map of carrierCode to full name
   * @returns Array of formatted offers, sorted by price
   */
  _formatFlightOffersDetailedInternal: (flightOffers: any[], airlineNames: Record<string, string> = {}) => {
    function getBaggageInfo(offer: any, segmentId: any) {
      for (const tp of offer.travelerPricings || []) {
        for (const fd of tp.fareDetailsBySegment || []) {
          if (fd.segmentId == segmentId) {
            return {
              checkedBags: fd.includedCheckedBags || null,
              cabinBags: fd.includedCabinBags || null,
              fareClass: fd.class,
              brandedFare: fd.brandedFare,
              brandedFareLabel: fd.brandedFareLabel,
              amenities: fd.amenities || []
            };
          }
        }
      }
      return {};
    }

    function formatSegments(segments: any[], offer: any) {
      return segments.map((seg, idx) => {
        let layover = null;
        if (idx > 0) {
          const prevArrival = new Date(segments[idx - 1].arrival.at);
          const thisDeparture = new Date(seg.departure.at);
          layover = Math.round((thisDeparture.getTime() - prevArrival.getTime()) / (60 * 1000));
        }
        const baggage = getBaggageInfo(offer, seg.id);
        return {
          airline: seg.carrierCode,
          airlineName: airlineNames[seg.carrierCode] || seg.carrierCode,
          flightNumber: seg.number,
          from: seg.departure.iataCode,
          fromTerminal: seg.departure.terminal,
          departureTime: seg.departure.at,
          to: seg.arrival.iataCode,
          toTerminal: seg.arrival.terminal,
          arrivalTime: seg.arrival.at,
          duration: seg.duration,
          layoverMinutes: layover,
          ...baggage // includes checkedBags, cabinBags, fareClass, brandedFare, amenities
        };
      });
    }

    const formatted = flightOffers.map(offer => {
      const outbound = offer.itineraries[0];
      const inbound = offer.itineraries[1];
      return {
        totalPrice: offer.price.total,
        currency: offer.price.currency,
        validatingAirline: offer.validatingAirlineCodes ? offer.validatingAirlineCodes[0] : null,
        outbound: {
          duration: outbound.duration,
          segments: formatSegments(outbound.segments, offer)
        },
        inbound: inbound
          ? {
              duration: inbound.duration,
              segments: formatSegments(inbound.segments, offer)
            }
          : null
      };
    });
    // Sort by price (ascending)
    formatted.sort((a, b) => parseFloat(a.totalPrice) - parseFloat(b.totalPrice));
    return formatted;
  },

  /**
   * Get flight price confirmation using Amadeus Flight Offers Price API
   * @param flightOffer Flight offer to price
   * @returns Confirmed price and flight details
   */
  confirmFlightPrice: async (flightOffer: any) => {
    try {
      const response = await amadeus.shopping.flightOffers.pricing.post(
        JSON.stringify({
          data: {
            type: 'flight-offers-pricing',
            flightOffers: [flightOffer]
          }
        })
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        throw new CustomError(error.response.data.errors[0].detail, error.response.statusCode || 500);
      }
      throw new CustomError('Error confirming flight price', 500);
    }
  },

  /**
   * Create flight order using Amadeus Flight Orders API
   * @param flightOffer Confirmed flight offer
   * @param travelers Traveler information
   * @param contacts Contact information
   * @returns Booking details
   */
  createFlightOrder: async (flightOffer: any, travelers: any[], contacts: any) => {
    try {
      const response = await amadeus.booking.flightOrders.post(
        JSON.stringify({
          data: {
            type: 'flight-order',
            flightOffers: [flightOffer],
            travelers: travelers,
            remarks: {
              general: [
                {
                  subType: 'GENERAL_MISCELLANEOUS',
                  text: 'Booked through IndusViaggi API'
                }
              ]
            },
            ticketingAgreement: {
              option: 'DELAY_TO_CANCEL',
              delay: '6D'
            },
            contacts: contacts
          }
        })
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        throw new CustomError(error.response.data.errors[0].detail, error.response.statusCode || 500);
      }
      throw new CustomError('Error creating flight order', 500);
    }
  },

  /**
   * Get flight order details using Amadeus Flight Orders API
   * @param orderId Flight order ID
   * @returns Flight order details
   */
  getFlightOrder: async (orderId: string) => {
    try {
      const response = await amadeus.booking.flightOrders(orderId).get();
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        throw new CustomError(error.response.data.errors[0].detail, error.response.statusCode || 500);
      }
      throw new CustomError('Error retrieving flight order', 500);
    }
  },

  /**
   * Search for airport/city using Amadeus Airport & City Search API
   * @param keyword Search keyword
   * @returns List of airports/cities
   */
  searchLocations: async (keyword: string) => {
    try {
      const response = await amadeus.referenceData.locations.get({
        keyword: keyword,
        subType: 'AIRPORT,CITY'
      });
      const locations = response.data;
      // Ensure only one entry per IATA code (prefer AIRPORT over CITY)
      const uniqueMap: Record<string, any> = {};
      for (const loc of locations) {
        const code = loc.iataCode;
        if (!code) continue;
        // If not set, or if current is AIRPORT and previous is CITY, set/replace
        if (!uniqueMap[code] || (loc.subType === 'AIRPORT' && uniqueMap[code].subType !== 'AIRPORT')) {
          uniqueMap[code] = loc;
        }
      }
      // Return only one result per IATA code
      return Object.values(uniqueMap);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        throw new CustomError(error.response.data.errors[0].detail, error.response.statusCode || 500);
      }
      throw new CustomError('Error searching locations', 500);
    }
  },

  /**
   * Get flight seat map using Amadeus Seat Maps API
   * @param flightOffer Flight offer
   * @returns Seat map details
   */
  getSeatMap: async (flightOffer: any) => {
    try {
      const response = await amadeus.shopping.seatmaps.post(
        JSON.stringify({
          data: [flightOffer]
        })
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        throw new CustomError(error.response.data.errors[0].detail, error.response.statusCode || 500);
      }
      throw new CustomError('Error retrieving seat map', 500);
    }
  }
};
