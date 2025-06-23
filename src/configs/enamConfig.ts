const enamConfig = {
  wsdl: {
    session: process.env.AMADEUS_SESSION_CREATE_ENDPOINT as string,
    sessionClose: process.env.AMADEUS_SESSION_CLOSE_ENDPOINT as string,
    search: process.env.AMADEUS_FLIGHT_SEARCH_ENDPOINT as string,
    location: process.env.AMADEUS_LOCATION_SEARCH_ENDPOINT as string,
    book: process.env.AMADEUS_FLIGHT_BOOK_ENDPOINT as string,
    cancel: process.env.AMADEUS_FLIGHT_CANCEL_ENDPOINT as string,
  },
  credentials: {
    username: process.env.AMADEUS_ENTERPRISE_USERNAME as string,
    password: process.env.AMADEUS_ENTERPRISE_PASSWORD as string,
    officeId: process.env.AMADEUS_ENTERPRISE_OFFICE_ID as string,
    organization: process.env.AMADEUS_ENTERPRISE_ORGANIZATION as string,
  },
  sessionTimeoutMinutes: Number(process.env.AMADEUS_SESSION_TIMEOUT_MINUTES) || 15,
  logSoapRequests: process.env.AMADEUS_LOG_SOAP_REQUESTS === 'true',
};

export default enamConfig;