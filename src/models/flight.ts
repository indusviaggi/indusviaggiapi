import { Schema, model } from "mongoose";

const segmentSchema = new Schema(
  {
    id: String,
    departureTime: Date,
    arrivalTime: Date,
    from: String,
    to: String,
    airLine: String,
    airlineName: String,
    flightNumber: String,
    baggage: String,
    cabinBags: String,
    amenities: String,
    travelClass: String,
    stay: String,
    segmentDuration: String,
    segmentDurationMinutes: Number,
  },
  { _id: false }
);

const itinerarySchema = new Schema(
  {
    duration: String,
    totalDuration: String,
    totalDurationMinutes: Number,
    segments: [segmentSchema],
  },
  { _id: false }
);

const passengerPriceSchema = new Schema(
  {
    travelerType: String,
    price: {
      total: String,
      base: String,
      currency: String,
    },
  },
  { _id: false }
);

const flightSchema = new Schema(
  {
    amadeusId: String, // to store Amadeus "id"
    ticketType: String,
    price: Number,
    travelClass: String,
    bookedTickets: Number,
    adults: Number,
    children: Number,
    infants: Number,
    passengerPrices: [passengerPriceSchema],
    departureItinerary: itinerarySchema,
    returnItinerary: { type: itinerarySchema, default: null },
  },
  { timestamps: true }
);

export default model("Flight", flightSchema);
