import EnterpriseAmadeusSession from '../models/enterpriseAmadeusSession';
import { parseStringPromise } from 'xml2js';
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from "path";

// Helper: Simulate SOAP/XML request (replace with real HTTP call in production)
export async function sendSoapRequest(xml: string, endpoint: string): Promise<string> {
  let mockFile = '';
  if (xml.includes('FlightSearchRQ')) {
    mockFile = path.join(__dirname, '../mocks/mockFlightSearchResponse.xml');
    return fs.readFileSync(mockFile, 'utf-8');
  } else if (xml.includes('LocationSearchRQ')) {
    mockFile = path.join(__dirname, '../mocks/mockLocationSearchResponse.xml');
    return fs.readFileSync(mockFile, 'utf-8');
  } else if (xml.includes('SessionCreateRQ')) {
    return `<?xml version="1.0"?><SessionCreateRS><SessionId>mock-session-id</SessionId></SessionCreateRS>`;
  } else if (xml.includes('SessionCloseRQ')) {
    return `<?xml version="1.0"?><SessionCloseRS><Status>Closed</Status></SessionCloseRS>`;
  }
  return '';
}

// Read endpoints and config from environment variables
const SESSION_CREATE_ENDPOINT = process.env.AMADEUS_SESSION_CREATE_ENDPOINT || '';
const SESSION_CLOSE_ENDPOINT = process.env.AMADEUS_SESSION_CLOSE_ENDPOINT || '';
const SESSION_TIMEOUT_MINUTES = parseInt(process.env.AMADEUS_SESSION_TIMEOUT_MINUTES || '15', 10);

export async function getOrCreateSession(userId: string): Promise<string> {
  let session = await EnterpriseAmadeusSession.findOne({ userId });
  if (session && session.sessionId && session.createdAt && (Date.now() - session.createdAt.getTime() < SESSION_TIMEOUT_MINUTES * 60 * 1000)) {
    return session.sessionId;
  }
  // Load Amadeus credentials from environment
  const username = process.env.AMADEUS_ENTERPRISE_USERNAME || '';
  const password = process.env.AMADEUS_ENTERPRISE_PASSWORD || '';
  const officeId = process.env.AMADEUS_ENTERPRISE_OFFICE_ID || '';
  const organization = process.env.AMADEUS_ENTERPRISE_ORGANIZATION || '';
  // Build SessionCreateRQ XML with credentials
  const sessionCreateXml = `
    <SessionCreateRQ>
      <UserID>
        <Username>${username}</Username>
        <Password>${password}</Password>
        <OfficeID>${officeId}</OfficeID>
        <Organization>${organization}</Organization>
      </UserID>
      <User>${userId}</User>
    </SessionCreateRQ>
  `;
  const responseXml = await sendSoapRequest(sessionCreateXml, SESSION_CREATE_ENDPOINT);
  const responseJson = await parseStringPromise(responseXml, { explicitArray: false });
  const sessionId = responseJson.SessionCreateRS.SessionId;
  if (session) {
    session.sessionId = sessionId;
    session.createdAt = new Date();
    await session.save();
  } else {
    await EnterpriseAmadeusSession.create({ userId, sessionId, createdAt: new Date(), data: {} });
  }
  return sessionId;
}

export async function closeSession(userId: string): Promise<void> {
  const session = await EnterpriseAmadeusSession.findOne({ userId });
  if (session && session.sessionId) {
    const sessionCloseXml = `<SessionCloseRQ><SessionId>${session.sessionId}</SessionId></SessionCloseRQ>`;
    await sendSoapRequest(sessionCloseXml, SESSION_CLOSE_ENDPOINT);
    await session.deleteOne();
  }
}
