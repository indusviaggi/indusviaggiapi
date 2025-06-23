import { SessionModel, ISession } from '../models/enamSession';

export const AmadeusSessionManager = {
  async createSession(userId: string, sessionToken: string, ttlMs = 30 * 60 * 1000): Promise<ISession> {
    const expiresAt = new Date(Date.now() + ttlMs);
    await SessionModel.deleteMany({ userId }); // Remove old sessions for this user
    const session = new SessionModel({ userId, sessionToken, expiresAt });
    return session.save();
  },

  async getSession(userId: string): Promise<ISession | null> {
    const session = await SessionModel.findOne({ userId }).sort({ createdAt: -1 });
    if (!session) return null;
    if (session.expiresAt.getTime() < Date.now()) {
      // Session expired, clean up
      await SessionModel.deleteOne({ _id: session._id });
      return null;
    }
    return session;
  },

  async destroySession(userId: string): Promise<void> {
    await SessionModel.deleteMany({ userId });
  },

  async cleanupSessions(): Promise<void> {
    await SessionModel.deleteMany({ expiresAt: { $lte: new Date() } });
  }
};