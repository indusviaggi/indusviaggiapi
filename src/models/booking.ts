import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  flight: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
  status: { type: String, enum: ["booked", "pending", "paid", "cancelled"], default: "pending" },
}, { timestamps: true });

export default model("Booking", bookingSchema);