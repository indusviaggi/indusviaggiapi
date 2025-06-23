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