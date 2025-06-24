import { SessionModel, ISession } from '../models/enamSession';
import { CustomError } from '../utils/customError'; 
export const AmadeusSessionManager = {
  async createSession(userId: string, sessionToken: string, ttlMs = 30 * 60 * 1000): Promise<ISession> {
    try {
      const expiresAt = new Date(Date.now() + ttlMs);
      await SessionModel.deleteMany({ userId }); // Remove old sessions for this user
      const session = new SessionModel({ userId, sessionToken, expiresAt });
      return await session.save();
    } catch (err: any) {
      throw new CustomError(err.message || 'Error creating session', 500);
    }
  },

  async getSession(userId: string): Promise<ISession | null> {
    try {
      const session = await SessionModel.findOne({ userId }).sort({ createdAt: -1 });
      if (!session) return null;
      if (session.expiresAt.getTime() < Date.now()) {
        // Session expired, clean up
        await SessionModel.deleteOne({ _id: session._id });
        return null;
      }
      return session;
    } catch (err: any) {
      throw new CustomError(err.message || 'Error getting session', 500);
    }
  },

  async destroySession(userId: string): Promise<void> {
    try {
      await SessionModel.deleteMany({ userId });
    } catch (err: any) {
      throw new CustomError(err.message || 'Error destroying session', 500);
    }
  },

  async cleanupSessions(): Promise<void> {
    try {
      await SessionModel.deleteMany({ expiresAt: { $lte: new Date() } });
    } catch (err: any) {
      throw new CustomError(err.message || 'Error cleaning up sessions', 500);
    }
  }
};