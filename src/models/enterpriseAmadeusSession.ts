// Model for storing Amadeus Enterprise session or custom fare data if needed
// This is a placeholder and should be extended as per actual requirements
import mongoose, { Schema, Document } from 'mongoose';

export interface IEnterpriseAmadeusSession extends Document {
  sessionId: string;
  createdAt: Date;
  data: any;
}

const EnterpriseAmadeusSessionSchema: Schema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  data: { type: Schema.Types.Mixed }
});

export default mongoose.model<IEnterpriseAmadeusSession>('EnterpriseAmadeusSession', EnterpriseAmadeusSessionSchema);
