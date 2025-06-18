import amadeus from '../configs/amadeus';
import { CustomError } from '../utils/customError';

export const AmadeusService = {
  getBaggage(flight: any, segmentId: string): string {
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
  },

  getCabinBags(flight: any, segmentId: string): string {
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
  },

  getAmenities(flight: any, segmentId: string): string {
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
  },

  getTravelClass(flight: any, segmentId: string): string {
    for (const tp of flight.travelerPricings || []) {
      for (const fd of tp.fareDetailsBySegment || []) {
        if (fd.segmentId == segmentId) {
          return fd.cabin || "-";
        }
      }
    }
    return "-";
  },

  getLayover(segments: any[], idx: number): string {
    if (idx === 0) return "No layover";
    const prevArrival = new Date(segments[idx - 1].arrival.at);
    const thisDeparture = new Date(segments[idx].departure.at);
    const mins = Math.round((thisDeparture.getTime() - prevArrival.getTime()) / (60 * 1000));
    if (mins < 1) return "No layover";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  },

  getAirlineName(carrierCode: string, airlineNames: Record<string, string>): string {
    return airlineNames[carrierCode] || carrierCode;
  },

  parseISODuration(duration: string): { hours: number, minutes: number } {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    return {
      hours: match && match[1] ? parseInt(match[1], 10) : 0,
      minutes: match && match[2] ? parseInt(match[2], 10) : 0
    };
  },

  formatSegments(segments: any[], flight: any, airlineNames: Record<string, string>) {
    return segments.map((seg: any, idx: number) => {
      // Use provided ISO 8601 duration
      const { hours, minutes } = AmadeusService.parseISODuration(seg.duration || "PT0M");
      const segmentDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      const durationMins = hours * 60 + minutes;
      return {
        id: seg.id,
        departureTime: seg.departure.at,
        arrivalTime: seg.arrival.at,
        from: seg.departure.iataCode,
        to: seg.arrival.iataCode,
        airLine: seg.carrierCode,
        airlineName: AmadeusService.getAirlineName(seg.carrierCode, airlineNames),
        flightNumber: seg.number,
        baggage: AmadeusService.getBaggage(flight, seg.id),
        cabinBags: AmadeusService.getCabinBags(flight, seg.id),
        amenities: AmadeusService.getAmenities(flight, seg.id),
        travelClass: AmadeusService.getTravelClass(flight, seg.id),
        stay: AmadeusService.getLayover(segments, idx),
        segmentDuration: segmentDuration,
        segmentDurationMinutes: durationMins
      };
    });
  },

  buildItinerary(itinerary: any, flight: any, airlineNames: Record<string, string>) {
    const segments = itinerary.segments;
    const { hours, minutes } = AmadeusService.parseISODuration(itinerary.duration || "PT0M");
    const totalDurationMinutes = hours * 60 + minutes;
    const totalDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    return {
      duration: itinerary.duration,
      totalDuration,
      totalDurationMinutes,
      segments: AmadeusService.formatSegments(segments, flight, airlineNames)
    };
  },

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
      // Build searchParams in a cleaner way
      const searchParams: any = {
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        currencyCode: params.currencyCode || "EUR",
        ...(params.adults && { adults: params.adults.toString() }),
        ...(params.infants && { infants: params.infants.toString() }),
        ...(params.returnDate && { returnDate: params.returnDate }),
        ...(params.children && { children: params.children.toString() }),
        ...(params.maxPrice && { maxPrice: params.maxPrice }),
        ...(params.max && { max: params.max }),
        ...(params.directFlightsOnly && { nonStop: true }),
        ...(params.travelClass && { travelClass: params.travelClass }),
        ...(params.includedAirlineCodes && params.includedAirlineCodes.length > 0 && {
          includedAirlineCodes: params.includedAirlineCodes.join(",")
        })
      };
      const response = await amadeus.shopping.flightOffersSearch.get(searchParams);
      //return response;
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
        const departureItinerary = AmadeusService.buildItinerary(flight.itineraries[0], flight, airlineNames);
        const returnItinerary = flight.itineraries[1] ? AmadeusService.buildItinerary(flight.itineraries[1], flight, airlineNames) : null;
        // Count passenger types
        const travelerCounts = { adults: 0, children: 0, infants: 0 };
        for (const tp of flight.travelerPricings || []) {
        if (tp.travelerType === 'ADULT') travelerCounts.adults++;
        else if (tp.travelerType === 'CHILD') travelerCounts.children++;
        else if (tp.travelerType === 'HELD_INFANT' || tp.travelerType === 'INFANT') travelerCounts.infants++;
        }
          // Extract separated prices per passenger
          const passengerPrices = (flight.travelerPricings || []).map((tp: any) => ({
            travelerType: tp.travelerType,
            price: {
              total: tp.price?.total,
              base: tp.price?.base,
              taxes: tp.price?.taxes,
              currency: tp.price?.currency
            }
          }));
          return {
            id: flight.id,
            ticketType: flight.itineraries.length > 1 ? "round-trip" : "one-way",
            price: flight.price.total,
            travelClass: AmadeusService.getTravelClass(flight, departureItinerary.segments[0]?.id) || null,
            bookedTickets: flight.travelerPricings.length,
            adults: travelerCounts.adults,
            children: travelerCounts.children,
            infants: travelerCounts.infants,
            passengerPrices,
            departureItinerary,
            returnItinerary,
          };
      });
      // Sort flights by price (low to high)
      flights.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
      return flights;
    } catch (error) {
      throw new CustomError('Error searching flights - ' + JSON.stringify(error), 500);
    }
  },
  
  /**
   * Search for airport/city using Amadeus Airport & City Search API
   * @param keyword Search keyword
   * @returns List of airports/cities
   */
  searchLocations: async (keyword: string, type: string) => {
    try {
      const response = await amadeus.referenceData.locations.get({
        keyword: keyword,
        subType: type,
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
      // Format for autocomplete: label, value, type, country
      return Object.values(uniqueMap).map((loc: any) => {
        let label = '';
        if (loc.subType === 'AIRPORT') {
          label = `${loc.iataCode} – ${loc.name}${loc.cityName ? ' / ' + loc.cityName : ''}${loc.countryName ? ', ' + loc.countryName : ''} (${loc.iataCode})`;
        } else {
          label = `${loc.cityName || loc.name}${loc.countryName ? ', ' + loc.countryName : ''} – All Airports (${loc.iataCode})`;
        }
        return {
          label,
          value: loc.iataCode,
          type: loc.subType,
          country: loc.countryName || '',
          city: loc.cityName || '',
          name: loc.name || ''
        };
      });
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        throw new CustomError(error.response.data.errors[0].detail, error.response.statusCode || 500);
      }
      throw new CustomError('Error searching locations', 500);
    }
  },
}