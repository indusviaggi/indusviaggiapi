import { Schema, model, Types } from "mongoose";

const passengerSchema = new Schema({
  booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
});

export default model("Passenger", passengerSchema);