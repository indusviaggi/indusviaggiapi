import soap from 'soap';
import enamConfig from '../configs/enamConfig';

/**
 * Creates and returns a SOAP client with WS-Security using your Amadeus credentials.
 * Optionally attaches a session token to the SOAP header.
 * If ENAM_MOCK is set to 'true', returns a mock client for development/testing.
 */
export const getSoapClient = async (wsdlUrl: string, sessionToken?: string): Promise<any> => {
  if (process.env.CURRENT_ENV === 'dev') {
    // Return a mock client with stubbed methods
    return {
      SessionCreateRQAsync: async () => [{ SessionCreateRS: { SessionId: 'mock-session-id' } }],
      Air_LowFareSearchAsync: async () => [{
        AirLowFareSearchRS: {
          PricedItineraries: {
            PricedItinerary: [
              {
                AirItinerary: {
                  OriginDestinationOptions: {
                    OriginDestinationOption: [
                      {
                        FlightSegment: [
                          {
                            DepartureAirport: { LocationCode: 'DEL' },
                            ArrivalAirport: { LocationCode: 'BOM' },
                            DepartureDateTime: '2024-07-01T10:00:00',
                            ArrivalDateTime: '2024-07-01T12:00:00',
                            MarketingAirline: { Code: 'AI', Name: 'Air India' },
                            FlightNumber: '101',
                            ResBookDesigCode: 'Y',
                          }
                        ]
                      }
                    ]
                  }
                },
                AirItineraryPricingInfo: {
                  ItinTotalFare: {
                    TotalFare: { Amount: '5000', CurrencyCode: 'INR' },
                    Taxes: { Tax: [{ Amount: '500', CurrencyCode: 'INR' }] }
                  },
                  FareInfos: {
                    FareInfo: [
                      {
                        FareReference: 'Y',
                        Cabin: 'Economy',
                        Meal: 'Meal',
                      }
                    ]
                  }
                }
              }
            ]
          }
        }
      }],
      Fare_MasterPricerTravelBoardSearchAsync: async () => [{
        Fare_MasterPricerTravelBoardSearchRS: {
          recommendations: [
            // One-way example
            {
              tripType: 'oneway',
              segmentFlightRef: [1],
              pricingInfo: {
                totalFareAmount: { amount: '5000', currency: 'INR' },
                baseFare: { amount: '4200', currency: 'INR' },
                taxes: [
                  { code: 'YQ', amount: '400', currency: 'INR' },
                  { code: 'IN', amount: '400', currency: 'INR' }
                ],
                validatingCarrier: 'AI',
                fareType: 'ECONOMY',
                brand: 'Basic',
                fareBasis: 'YFLEX',
                refundability: 'Refundable',
                changeability: 'Changeable',
                ticketingInfo: {
                  ticketType: 'eTicket',
                  ticketTimeLimit: '2024-07-01T23:59:00'
                },
                passengerInfo: [
                  { type: 'ADT', quantity: 1 }
                ],
                baggage: { quantity: 1, unit: 'PC', weight: 23, weightUnit: 'KG' },
                amenities: ['WiFi', 'In-seat Power', 'Meal: Vegetarian'],
                seatSelection: true,
                loungeAccess: false
              },
              segment: {
                departure: { airport: 'DEL', dateTime: '2024-07-01T10:00:00', terminal: '3' },
                arrival: { airport: 'BOM', dateTime: '2024-07-01T12:00:00', terminal: '2' },
                airline: { code: 'AI', name: 'Air India' },
                flightNumber: '101',
                bookingClass: 'Y',
                aircraft: '788',
                stops: 0,
                duration: '2:00',
                meal: 'Vegetarian',
                codeShare: false
              }
            },
            // Round-trip example
            {
              tripType: 'roundtrip',
              segmentFlightRef: [2, 3],
              pricingInfo: {
                totalFareAmount: { amount: '13000', currency: 'INR' },
                baseFare: { amount: '11400', currency: 'INR' },
                taxes: [
                  { code: 'YQ', amount: '900', currency: 'INR' },
                  { code: 'IN', amount: '700', currency: 'INR' }
                ],
                validatingCarrier: '6E',
                fareType: 'ECONOMY',
                brand: 'Flex',
                fareBasis: 'BFLEX',
                refundability: 'Non-Refundable',
                changeability: 'Changeable with Fee',
                ticketingInfo: {
                  ticketType: 'eTicket',
                  ticketTimeLimit: '2024-07-10T23:59:00'
                },
                passengerInfo: [
                  { type: 'ADT', quantity: 2 },
                  { type: 'CHD', quantity: 1 }
                ],
                baggage: { quantity: 2, unit: 'PC', weight: 15, weightUnit: 'KG' },
                amenities: ['Extra Legroom', 'Meal: Snack'],
                seatSelection: true,
                loungeAccess: false
              },
              segments: [
                {
                  departure: { airport: 'DEL', dateTime: '2024-07-01T15:00:00', terminal: '1D' },
                  arrival: { airport: 'BLR', dateTime: '2024-07-01T17:30:00', terminal: 'A' },
                  airline: { code: '6E', name: 'IndiGo' },
                  flightNumber: '202',
                  bookingClass: 'B',
                  aircraft: '320',
                  stops: 0,
                  duration: '2:30',
                  meal: 'Snack',
                  codeShare: false
                },
                {
                  departure: { airport: 'BLR', dateTime: '2024-07-10T09:00:00', terminal: 'A' },
                  arrival: { airport: 'DEL', dateTime: '2024-07-10T11:30:00', terminal: '3' },
                  airline: { code: '6E', name: 'IndiGo' },
                  flightNumber: '203',
                  bookingClass: 'B',
                  aircraft: '320',
                  stops: 0,
                  duration: '2:30',
                  meal: 'Snack',
                  codeShare: false
                }
              ]
            },
            // One-way business
            {
              tripType: 'oneway',
              segmentFlightRef: [4],
              pricingInfo: {
                totalFareAmount: { amount: '12000', currency: 'INR' },
                baseFare: { amount: '10500', currency: 'INR' },
                taxes: [
                  { code: 'YQ', amount: '900', currency: 'INR' },
                  { code: 'IN', amount: '600', currency: 'INR' }
                ],
                validatingCarrier: 'UK',
                fareType: 'BUSINESS',
                brand: 'Business Saver',
                fareBasis: 'JFLEX',
                refundability: 'Refundable',
                changeability: 'Changeable',
                ticketingInfo: {
                  ticketType: 'eTicket',
                  ticketTimeLimit: '2024-07-02T23:59:00'
                },
                passengerInfo: [
                  { type: 'ADT', quantity: 1 },
                  { type: 'INF', quantity: 1 }
                ],
                baggage: { quantity: 2, unit: 'PC', weight: 32, weightUnit: 'KG' },
                amenities: ['Lounge Access', 'Priority Boarding', 'Meal: Gourmet'],
                seatSelection: true,
                loungeAccess: true
              },
              segment: {
                departure: { airport: 'DEL', dateTime: '2024-07-02T09:00:00', terminal: '3' },
                arrival: { airport: 'COK', dateTime: '2024-07-02T12:00:00', terminal: '1' },
                airline: { code: 'UK', name: 'Vistara' },
                flightNumber: '303',
                bookingClass: 'J',
                aircraft: '321',
                stops: 0,
                duration: '3:00',
                meal: 'Gourmet',
                codeShare: false
              }
            },
            // One-way economy
            {
              tripType: 'oneway',
              segmentFlightRef: [5],
              pricingInfo: {
                totalFareAmount: { amount: '7000', currency: 'INR' },
                baseFare: { amount: '6200', currency: 'INR' },
                taxes: [
                  { code: 'YQ', amount: '400', currency: 'INR' },
                  { code: 'IN', amount: '400', currency: 'INR' }
                ],
                validatingCarrier: 'SG',
                fareType: 'ECONOMY',
                brand: 'Saver',
                fareBasis: 'SFLEX',
                refundability: 'Non-Refundable',
                changeability: 'Non-Changeable',
                ticketingInfo: {
                  ticketType: 'eTicket',
                  ticketTimeLimit: '2024-07-03T23:59:00'
                },
                passengerInfo: [
                  { type: 'ADT', quantity: 1 }
                ],
                baggage: { quantity: 1, unit: 'PC', weight: 20, weightUnit: 'KG' },
                amenities: ['Window Seat', 'Meal: Vegetarian'],
                seatSelection: false,
                loungeAccess: false
              },
              segment: {
                departure: { airport: 'DEL', dateTime: '2024-07-03T06:00:00', terminal: '2' },
                arrival: { airport: 'GOI', dateTime: '2024-07-03T08:30:00', terminal: 'D' },
                airline: { code: 'SG', name: 'SpiceJet' },
                flightNumber: '404',
                bookingClass: 'S',
                aircraft: '737',
                stops: 0,
                duration: '2:30',
                meal: 'Vegetarian',
                codeShare: false
              }
            }
          ]
        }
      }],
      PNR_AddMultiElementsAsync: async () => [{
        PNRAddMultiElementsRS: {
          Success: true,
          BookingReferenceID: 'PNR123456',
          ItineraryRef: { ID: 'ITN123456' },
          TravelerInfo: {
            AirTraveler: [
              { PassengerTypeCode: 'ADT', PersonName: { GivenName: 'John', Surname: 'Doe' } }
            ]
          },
          Ticketing: { TicketType: 'eTicket', TicketTimeLimit: '2024-07-01T23:59:00' }
        }
      }],
      PNR_CancelAsync: async () => [{
        PNRCancelRS: {
          Success: true,
          CancelledPNR: 'PNR123456',
          Message: 'Booking cancelled successfully.'
        }
      }],
      SessionCloseRQAsync: async () => [{}],
    };
  }

  const { username, password, officeId, organization } = enamConfig.credentials;
  const wsSecurity = new soap.WSSecurity(username, password);

  const client = await soap.createClientAsync(wsdlUrl);
  client.setSecurity(wsSecurity);

  // Optionally add officeId/organization or other headers if required by Amadeus
  client.addSoapHeader({
    'AMA_SecurityHeader': {
      'OfficeId': officeId,
      'Organization': organization,
    }
  });

  if (sessionToken) {
    client.addSoapHeader({ Session: { SessionToken: sessionToken } });
  }

  // Optional: Log SOAP requests if enabled
  if (enamConfig.logSoapRequests) {
    client.on('request', (xml: string) => {
      console.log('SOAP Request:', xml);
    });
    client.on('response', (xml: string) => {
      console.log('SOAP Response:', xml);
    });
  }

  return client;
};