import { Schema, model, Types } from "mongoose";

const paymentSchema = new Schema({
  booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["bonfico", "card", "cash", "other"], required: true },
  status: { type: String, enum: ["pending", "completed", "partial", "failed"], default: "pending" },
  transactionId: { type: String },
  paidAt: { type: Date }
}, { timestamps: true });

export default model("Payment", paymentSchema);