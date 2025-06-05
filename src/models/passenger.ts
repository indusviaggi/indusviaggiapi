import { Schema, model, Types } from "mongoose";

const passengerSchema = new Schema({
  booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  passportNumber: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
});

export default model("Passenger", passengerSchema);