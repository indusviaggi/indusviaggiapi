import { getSoapClient } from '../utils/enamSoapClient';
import { buildSearchRequest, buildBookRequest, buildCancelRequest } from '../utils/enamRequestBuilders';
import enamConfig from '../configs/enamConfig';
import { AmadeusSessionManager } from '../sessions/enamSessionManager';
import { FlightSearchParams, FlightBookParams, FlightCancelParams } from '../../types/enamTypes';
import { ISession } from '../models/enamSession';

async function getOrCreateSession(userId: string): Promise<ISession> {
  let session = await AmadeusSessionManager.getSession(userId);
  if (!session) {
    session = await AmadeusService.createAmadeusSession(userId);
  }
  return session;
}

export const AmadeusService = {
  /**
   * Creates a new Amadeus session and stores it in MongoDB.
   */
  async createAmadeusSession(userId: string): Promise<ISession> {
    const client = await getSoapClient(enamConfig.wsdl.session);
    const request = {
      SessionCreateRQ: {
        POS: {
          Source: {
            PseudoCityCode: enamConfig.credentials.officeId,
            RequestorID: {
              Type: "1",
              ID: enamConfig.credentials.username,
              CompanyName: {
                Code: enamConfig.credentials.organization
              }
            }
          }
        }
      }
    };
    const [result] = await client.SessionCreateRQAsync(request);
    const sessionToken =
      result?.SessionCreateRS?.SessionId ||
      result?.SessionCreateRS?.EchoToken ||
      result?.SessionCreateRS?.SecurityToken ||
      result?.SessionCreateRS?.SessionToken;

    if (!sessionToken) throw new Error('Failed to create Amadeus session');
    return await AmadeusSessionManager.createSession(userId, sessionToken);
  },

  /**
   * Searches for flights using Amadeus, managing session via MongoDB.
   */
  async searchFlights(params: FlightSearchParams, userId: string): Promise<any> {
    const session = await getOrCreateSession(userId);
    const client = await getSoapClient(enamConfig.wsdl.search, session.sessionToken);
    const request = buildSearchRequest(params);
    const [result] = await client.Air_LowFareSearchAsync(request);
    return result;
  },

  /**
   * Books a flight using Amadeus, managing session via MongoDB.
   */
  async bookFlight(params: FlightBookParams, userId: string): Promise<any> {
    const session = await getOrCreateSession(userId);
    const client = await getSoapClient(enamConfig.wsdl.book, session.sessionToken);
    const request = buildBookRequest(params);
    const [result] = await client.PNR_AddMultiElementsAsync(request);
    return result;
  },

  /**
   * Cancels a booking using Amadeus, managing session via MongoDB.
   */
  async cancelBooking(params: FlightCancelParams, userId: string): Promise<any> {
    let session = await getOrCreateSession(userId);
    if (!session) {
      session = await this.createAmadeusSession(userId);
    }
    const client = await getSoapClient(enamConfig.wsdl.cancel, session.sessionToken);
    const request = buildCancelRequest(params);
    const [result] = await client.PNR_CancelAsync(request);
    return result;
  },

  /**
   * Closes an Amadeus session and removes it from MongoDB.
   */
  async closeAmadeusSession(userId: string): Promise<void> {
    const session = await getOrCreateSession(userId);
    if (!session) return;

    const client = await getSoapClient(enamConfig.wsdl.sessionClose, session.sessionToken);
    const request = {
      SessionCloseRQ: {
        POS: {
          Source: {
            PseudoCityCode: enamConfig.credentials.officeId
          }
        }
      }
    };

    try {
      await client.SessionCloseRQAsync(request);
    } catch (err) {
      // Optionally log error, but proceed to cleanup session
    }

    await AmadeusSessionManager.destroySession(userId);
  }
};