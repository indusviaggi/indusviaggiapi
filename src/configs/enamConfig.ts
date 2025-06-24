const enamConfig = {
  wsdl: {
    session: process.env.AMADEUS_SESSION_CREATE_ENDPOINT || '',
    sessionClose: process.env.AMADEUS_SESSION_CLOSE_ENDPOINT || '',
    search: process.env.AMADEUS_FLIGHT_SEARCH_ENDPOINT || '',
    location: process.env.AMADEUS_LOCATION_SEARCH_ENDPOINT || '',
    book: process.env.AMADEUS_FLIGHT_BOOK_ENDPOINT || '',
    cancel: process.env.AMADEUS_FLIGHT_CANCEL_ENDPOINT || '',
  },
  credentials: {
    username: process.env.AMADEUS_ENTERPRISE_USERNAME || '',
    password: process.env.AMADEUS_ENTERPRISE_PASSWORD || '',
    officeId: process.env.AMADEUS_ENTERPRISE_OFFICE_ID || '',
    organization: process.env.AMADEUS_ENTERPRISE_ORGANIZATION || '',
  },
  sessionTimeoutMinutes: Number(process.env.AMADEUS_SESSION_TIMEOUT_MINUTES) || 15,
  logSoapRequests: process.env.AMADEUS_LOG_SOAP_REQUESTS === 'true',
};

export default enamConfig;