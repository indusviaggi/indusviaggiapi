import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  flight: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
  seats: [{ type: String, required: true }], // Array of seat numbers
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["booked", "pending", "cancelled"], default: "booked" },
  bookedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default model("Booking", bookingSchema);