import { Schema, model } from "mongoose";

const flightSchema = new Schema({
  flightNumber: { type: String, required: true, unique: true },
  airline: { type: String, required: true },
  origin: { type: String, required: true }, // Airport code or city
  destination: { type: String, required: true }, // Airport code or city
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  seats: [
    {
      seatNumber: String,
      class: { type: String, enum: ["economy", "business", "first"] },
      isBooked: { type: Boolean, default: false }
    }
  ],
  price: { type: Number, required: true }
}, { timestamps: true });

export default model("Flight", flightSchema);