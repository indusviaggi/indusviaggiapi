import amadeus from '../configs/amadeus';
import { CustomError } from '../utils/customError';

// Helper functions for segment info extraction
function getBaggage(flight: any, segmentId: string): string {
  for (const tp of flight.travelerPricings || []) {
    for (const fd of tp.fareDetailsBySegment || []) {
      if (fd.segmentId == segmentId) {
        if (fd.includedCheckedBags) {
          if (fd.includedCheckedBags.quantity) {
            return `${fd.includedCheckedBags.quantity} piece(s)`;
          } else if (fd.includedCheckedBags.weight && fd.includedCheckedBags.weightUnit) {
            return `${fd.includedCheckedBags.weight}${fd.includedCheckedBags.weightUnit}`;
          }
        }
      }
    }
  }
  return "-";
}

function getCabinBags(flight: any, segmentId: string): string {
  for (const tp of flight.travelerPricings || []) {
    for (const fd of tp.fareDetailsBySegment || []) {
      if (fd.segmentId == segmentId) {
        if (fd.includedCabinBags && fd.includedCabinBags.quantity) {
          return `${fd.includedCabinBags.quantity} piece(s)`;
        }
      }
    }
  }
  return "-";
}

function getAmenities(flight: any, segmentId: string): string {
  for (const tp of flight.travelerPricings || []) {
    for (const fd of tp.fareDetailsBySegment || []) {
      if (fd.segmentId == segmentId) {
        if (fd.amenities && Array.isArray(fd.amenities) && fd.amenities.length > 0) {
          return fd.amenities.map((a: any) => a.description).join(", ");
        }
      }
    }
  }
  return "-";
}

function getTravelClass(flight: any, segmentId: string): string {
  for (const tp of flight.travelerPricings || []) {
    for (const fd of tp.fareDetailsBySegment || []) {
      if (fd.segmentId == segmentId) {
        return fd.cabin || "-";
      }
    }
  }
  return "-";
}

function getLayover(segments: any[], idx: number): string {
  if (idx === 0) return "No layover";
  const prevArrival = new Date(segments[idx - 1].arrival.at);
  const thisDeparture = new Date(segments[idx].departure.at);
  const mins = Math.round((thisDeparture.getTime() - prevArrival.getTime()) / (60 * 1000));
  if (mins < 1) return "No layover";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function getAirlineName(carrierCode: string, airlineNames: Record<string, string>): string {
  return airlineNames[carrierCode] || carrierCode;
}

function formatSegments(segments: any[], flight: any, airlineNames: Record<string, string>) {
  return segments.map((seg: any, idx: number) => ({
    departureTime: seg.departure.at,
    arrivalTime: seg.arrival.at,
    from: seg.departure.iataCode,
    to: seg.arrival.iataCode,
    airLine: seg.carrierCode,
    airlineName: getAirlineName(seg.carrierCode, airlineNames),
    flightNumber: seg.number,
    baggage: getBaggage(flight, seg.id),
    cabinBags: getCabinBags(flight, seg.id),
    amenities: getAmenities(flight, seg.id),
    travelClass: getTravelClass(flight, seg.id),
    stay: getLayover(segments, idx)
  }));
}

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
    travelClass?: "ECONOMY" | "BUSINESS" | "PREMIUM_ECONOMY" | "FIRST";
    currencyCode?: string;
    maxPrice?: number;
    max?: number;
    directFlightsOnly?: boolean;
    includedAirlineCodes?: string[];
  }) => {
    try {
      const searchParams: any = {
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        adults: params.adults.toString(),
        currencyCode: params.currencyCode || "EUR",
      };
      if (params.returnDate) {
        searchParams.returnDate = params.returnDate;
      }
      if (params.children) {
        searchParams.children = params.children.toString();
      }
      if (params.maxPrice) {
        searchParams.maxPrice = params.maxPrice;
      }
      if (params.max) {
        searchParams.max = params.max;
      }
      if (params.directFlightsOnly) {
        searchParams.nonStop = true;
      }
      if (params.travelClass) {
        searchParams.travelClass = params.travelClass;
      }
      if(params.includedAirlineCodes && params.includedAirlineCodes.length > 0) {
        searchParams.includedAirlineCodes = params.includedAirlineCodes.join(",");
      }
      const response = await amadeus.shopping.flightOffersSearch.get(searchParams);
      // Collect all unique carrier codes from all segments
      const carrierCodes = new Set<string>();
      for (const flight of response.data) {
        for (const itin of flight.itineraries) {
          for (const seg of itin.segments) {
            carrierCodes.add(seg.carrierCode);
          }
        }
      }
      // Fetch airline names
      const airlineNames = await AmadeusService.getAirlineNames(Array.from(carrierCodes));
      const flights = response.data.map((flight: any) => {
        // Departure (first itinerary)
        const depSegments = flight.itineraries[0].segments;
        // Return trip (second itinerary, if exists)
        let retTrip = null;
        if (flight.itineraries.length > 1) {
          const retSegments = flight.itineraries[1].segments;
          retTrip = {
            duration: flight.itineraries[1].duration,
            segments: formatSegments(retSegments, flight, airlineNames)
          };
        }
        const newFlight = {
          ticketType: flight.itineraries.length > 1 ? "round-trip" : "one-way",
          departure: {
            duration: flight.itineraries[0].duration,
            segments: formatSegments(depSegments, flight, airlineNames)
          },
          return: retTrip,
          price: flight.price.total,
          travelClass: (depSegments[0] && getTravelClass(flight, depSegments[0].id)) || null,
          bookedTickets: flight.travelerPricings.length,
        };
        return newFlight;
      });
      return flights;
    } catch (error) {
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
