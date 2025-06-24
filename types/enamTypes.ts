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

export interface FlightCancelParams {
  pnr: string;
  [key: string]: any;
}

export interface FlightBookParams {
  travellers: TravellerInfo[];
  contact: ContactInfo;
  segments: SegmentInfo[];
  remarks?: string;
  payment?: PaymentInfo;
}

export interface TravellerInfo {
  firstName: string;
  lastName: string;
  title: string; // MR, MRS, MS, MISS, etc.
  gender: 'M' | 'F';
  dateOfBirth: string; // YYYY-MM-DD
  type: 'ADT' | 'CHD' | 'INF';
  nationality: string;
  passportNumber?: string;
  passportExpiry?: string; // YYYY-MM-DD
  documentType?: string; // PASSPORT, ID, etc.
  associatedAdultIndex?: number; // For infants: associate with adult by index or reference
}

export interface ContactInfo {
  email: string;
  phone: string;
  address?: string;
}

export interface SegmentInfo {
  from: string;
  to: string;
  departureDate: string; // YYYY-MM-DD
  flightNumber: string;
  airline: string;
  bookingClass?: string;
}

export interface PaymentInfo {
  method: string; // CASH, CARD, etc.
  cardNumber?: string;
  cardExpiry?: string;
  cardHolder?: string;
}
