// Model to store full Amadeus Enterprise flight response (as JSON)
import mongoose, { Schema, Document } from 'mongoose';

export interface IEnterpriseAmadeusFlight extends Document {
  searchParams: any; // The search parameters used
  rawXml?: string;   // Optionally store the raw XML response
  data: any;         // The parsed JSON data from Amadeus
  createdAt: Date;
}

const EnterpriseAmadeusFlightSchema: Schema = new Schema({
  searchParams: { type: Schema.Types.Mixed, required: true },
  rawXml: { type: String },
  data: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEnterpriseAmadeusFlight>('EnterpriseAmadeusFlight', EnterpriseAmadeusFlightSchema);
