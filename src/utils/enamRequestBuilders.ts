import { FlightSearchParams, FlightBookParams, FlightCancelParams } from '../../types/enamTypes';

export const buildSearchRequest = (params: FlightSearchParams): any => ({
  // TODO: Build according to Amadeus Air_LowFareSearch schema
  OTA_AirLowFareSearchRQ: {
    POS: { /* ... */ },
    OriginDestinationInformation: [ /* ... */ ],
    // ...
  }
});

export const buildBookRequest = (params: FlightBookParams): any => ({
  // TODO: Build according to Amadeus PNR_AddMultiElements schema
  PNR_AddMultiElementsRQ: {
    // ...
  }
});

export const buildCancelRequest = (params: FlightCancelParams): any => ({
  // TODO: Build according to Amadeus PNR_Cancel schema
  PNR_CancelRQ: {
    ReservationInfo: { PNR: params.pnr }
  }
});