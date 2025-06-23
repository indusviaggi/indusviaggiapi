export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass?: string;
  [key: string]: any;
}

export interface FlightBookParams {
  pnrData: any; // Replace with actual structure
  passengers: any[]; // Replace with actual structure
  paymentInfo: any; // Replace with actual structure
  [key: string]: any;
}

export interface FlightCancelParams {
  pnr: string;
  [key: string]: any;
}