import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  userId: string;
  sessionToken: string;
  createdAt: Date;
  expiresAt: Date;
}

const enamSessionSchema = new Schema<ISession>({
  userId: { type: String, required: true, index: true },
  sessionToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

export const SessionModel = mongoose.model<ISession>('EnamSession', enamSessionSchema);