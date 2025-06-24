import { FlightSearchParams, FlightBookParams, FlightCancelParams } from '../../types/enamTypes';

export const buildSearchRequest = (params: FlightSearchParams): any => ({
  OTA_AirLowFareSearchRQ: {
    POS: {
      Source: {
        PseudoCityCode: process.env.AMADEUS_ENTERPRISE_OFFICE_ID || 'DEFAULT',
        RequestorID: {
          Type: '1',
          ID: process.env.AMADEUS_ENTERPRISE_USERNAME || 'USERNAME',
          CompanyName: {
            Code: process.env.AMADEUS_ENTERPRISE_ORGANIZATION || 'ORG'
          }
        }
      }
    },
    OriginDestinationInformation: [
      {
        DepartureDateTime: params.departureDate,
        OriginLocation: { LocationCode: params.origin },
        DestinationLocation: { LocationCode: params.destination }
      },
      ...(params.returnDate ? [{
        DepartureDateTime: params.returnDate,
        OriginLocation: { LocationCode: params.destination },
        DestinationLocation: { LocationCode: params.origin }
      }] : [])
    ],
    TravelerInfoSummary: {
      AirTravelerAvail: [
        {
          PassengerTypeQuantity: [
            { Code: 'ADT', Quantity: params.adults },
            ...(params.children ? [{ Code: 'CHD', Quantity: params.children }] : []),
            ...(params.infants ? [{ Code: 'INF', Quantity: params.infants }] : [])
          ]
        }
      ],
      ...(params.cabinClass ? { CabinPref: [{ Cabin: params.cabinClass }] } : {})
    },
    TPA_Extensions: {
      BrandedFares: {
        Enabled: true
      },
      BaggageInfo: {
        Enabled: true
      }
    },
  }
});

export const buildBookRequest = (params: FlightBookParams): any => ({
  PNR_AddMultiElementsRQ: {
    POS: {
      Source: {
        PseudoCityCode: process.env.AMADEUS_ENTERPRISE_OFFICE_ID || 'DEFAULT',
        RequestorID: {
          Type: '1',
          ID: process.env.AMADEUS_ENTERPRISE_USERNAME || 'USERNAME',
          CompanyName: {
            Code: process.env.AMADEUS_ENTERPRISE_ORGANIZATION || 'ORG'
          }
        }
      }
    },
    travellerInfo: params.travellers.map((traveller, idx) => ({
      Surname: traveller.lastName,
      GivenName: traveller.firstName,
      Title: traveller.title,
      Gender: traveller.gender,
      DateOfBirth: traveller.dateOfBirth,
      PassengerType: traveller.type,
      Nationality: traveller.nationality,
      ...(traveller.passportNumber ? { PassportNumber: traveller.passportNumber } : {}),
      ...(traveller.passportExpiry ? { PassportExpiry: traveller.passportExpiry } : {}),
      ...(traveller.documentType ? { DocumentType: traveller.documentType } : {}),
      ...(traveller.associatedAdultIndex !== undefined ? { AssociatedAdultIndex: traveller.associatedAdultIndex } : {})
    })),
    contactInfo: {
      Email: params.contact.email,
      Phone: params.contact.phone,
      ...(params.contact.address ? { Address: params.contact.address } : {})
    },
    itineraryInfo: params.segments.map(segment => ({
      DepartureDate: segment.departureDate,
      From: segment.from,
      To: segment.to,
      FlightNumber: segment.flightNumber,
      Airline: segment.airline,
      ...(segment.bookingClass ? { BookingClass: segment.bookingClass } : {})
    })),
    ...(params.remarks ? { remarks: params.remarks } : {}),
    ...(params.payment ? { payment: params.payment } : {})
  }
});

export const buildCancelRequest = (params: FlightCancelParams): any => ({
  PNR_CancelRQ: {
    POS: {
      Source: {
        PseudoCityCode: process.env.AMADEUS_ENTERPRISE_OFFICE_ID || 'DEFAULT',
        RequestorID: {
          Type: '1',
          ID: process.env.AMADEUS_ENTERPRISE_USERNAME || 'USERNAME',
          CompanyName: {
            Code: process.env.AMADEUS_ENTERPRISE_ORGANIZATION || 'ORG'
          }
        }
      }
    },
    ReservationInfo: {
      PNR: params.pnr
    },
    // Optionally add more fields if required by ENAM/Amadeus
  }
});

// Master Pricer Travel Board Search builder
export const buildMasterPricerRequest = (params: FlightSearchParams): any => ({
  Fare_MasterPricerTravelBoardSearch: {
    numberOfUnit: {
      unitNumberDetail: [
        { numberOfUnits: params.adults + (params.children || 0) + (params.infants || 0), typeOfUnit: 'PX' },
        { numberOfUnits: 200, typeOfUnit: 'RC' } // 200 recommendations (example)
      ]
    },
    paxReference: [
      ...Array(params.adults).fill({ ptc: 'ADT' }),
      ...(params.children ? Array(params.children).fill({ ptc: 'CHD' }) : []),
      ...(params.infants ? Array(params.infants).fill({ ptc: 'INF' }) : [])
    ],
    itinerary: [
      {
        requestedSegmentRef: { segRef: 1 },
        departureLocalization: { departurePoint: { locationId: params.origin } },
        arrivalLocalization: { arrivalPointDetails: { locationId: params.destination } },
        timeDetails: { firstDateTimeDetail: { date: params.departureDate.replace(/-/g, '') } }
      },
      ...(params.returnDate ? [{
        requestedSegmentRef: { segRef: 2 },
        departureLocalization: { departurePoint: { locationId: params.destination } },
        arrivalLocalization: { arrivalPointDetails: { locationId: params.origin } },
        timeDetails: { firstDateTimeDetail: { date: params.returnDate.replace(/-/g, '') } }
      }] : [])
    ],
    travelFlightInfo: params.cabinClass ? { cabinClass: { cabin: params.cabinClass } } : undefined
  }
});