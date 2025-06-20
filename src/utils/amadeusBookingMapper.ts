function ensureArray(val) {
  if (val === undefined || val === null) return [];
  return Array.isArray(val) ? val : [val];
}

function inferTripType(segments) {
  if (segments.length < 2) return 'oneway';
  const firstFrom = segments[0]?.from;
  const lastTo = segments[segments.length - 1]?.to;
  return firstFrom && lastTo && firstFrom === lastTo ? 'roundtrip' : 'oneway';
}

export function mapAmadeusToBookingOptions(reply) {
  const currency = reply.conversionRate?.conversionRateDetail?.currency || '';
  const flightIndex = reply.flightIndex;
  const recommendations = ensureArray(reply.recommendation);
  const groupOfFlightsMap = {};

  if (flightIndex) {
    const indexes = ensureArray(flightIndex);
    for (const idx of indexes) {
      if (!idx.groupOfFlights) continue;
      const groups = ensureArray(idx.groupOfFlights);
      for (const group of groups) {
        const proposals = ensureArray(group.propFlightGrDetail.flightProposal);
        const ref = proposals[0]?.ref;
        groupOfFlightsMap[ref] = group;
      }
    }
  }

  function parseDateTime(date, time) {
    if (!date || !time) return null;
    const year = 2000 + parseInt(date.substring(0, 2), 10);
    const month = parseInt(date.substring(2, 4), 10) - 1;
    const day = parseInt(date.substring(4, 6), 10);
    const hour = parseInt(time.substring(0, 2), 10);
    const minute = parseInt(time.substring(2, 4), 10);
    return new Date(Date.UTC(year, month, day, hour, minute));
  }

  function calcDurationMinutes(dep, arr) {
    if (!dep || !arr) return null;
    return Math.round((arr.getTime() - dep.getTime()) / 60000);
  }

  return recommendations.map((rec, idx) => {
    let segmentRefs = [];
    if (rec.segmentFlightRef) {
      const refs = ensureArray(rec.segmentFlightRef);
      refs.forEach((s) => {
        const details = ensureArray(s.referencingDetail);
        details.forEach((d) => {
          if (d.refNumber) segmentRefs.push(d.refNumber);
        });
      });
    }

    const segments = segmentRefs.map(ref => {
      const group = groupOfFlightsMap[ref];
      if (!group) return null;
      const flightDetails = ensureArray(group.flightDetails);
      return flightDetails.map((fd) => {
        const info = fd.flightInformation;
        if (!info) return null;
        const locations = ensureArray(info.location);
        const depTime = parseDateTime(info.productDateTime?.dateOfDeparture, info.productDateTime?.timeOfDeparture);
        const arrTime = parseDateTime(info.productDateTime?.dateOfArrival, info.productDateTime?.timeOfArrival);
        return {
          segmentId: ref,
          departureTime: depTime,
          arrivalTime: arrTime,
          from: locations[0]?.locationId || '',
          to: locations[locations.length - 1]?.locationId || '',
          departureTerminal: locations[0]?.terminal || '',
          arrivalTerminal: locations[locations.length - 1]?.terminal || '',
          airline: info.companyId?.marketingCarrier || '',
          operatingCarrier: info.companyId?.operatingCarrier || '',
          flightNumber: info.flightOrtrainNumber || '',
          equipmentType: info.productDetail?.equipmentType || '',
          electronicTicketing: info.addProductDetail?.electronicTicketing || '',
          productDetailQualifier: info.addProductDetail?.productDetailQualifier || '',
          amenities: info.productDetail?.equipmentType || '',
          segmentDuration: depTime && arrTime ? `${calcDurationMinutes(depTime, arrTime)} min` : '',
          segmentDurationMinutes: calcDurationMinutes(depTime, arrTime),
          stay: '',
          baggage: '',
          cabinBags: '',
        };
      });
    }).flat().filter(Boolean);

    // Infer trip type (oneway/roundtrip)
    const tripType = inferTripType(segments);

    // travelClass: take first available from fareDetails
    let travelClass = '';
    let bookingClass = '';
    let bookingClassDesignator = '';
    let availabilityStatus = '';
    let fareBasis = '';
    let fareType = '';
    let cabin = '';
    const paxFare = rec.paxFareProduct?.paxFareDetail || {};
    const fareDetails = rec.paxFareProduct?.fareDetails || {};
    const groupOfFares = ensureArray(fareDetails.groupOfFares);
    if (groupOfFares.length > 0) {
      const g = groupOfFares[0].productInformation;
      travelClass = g?.cabinProduct?.cabin || '';
      bookingClass = g?.cabinProduct?.rbd || '';
      fareBasis = g?.fareProductDetail?.fareBasis || '';
      fareType = g?.fareProductDetail?.fareType || '';
      cabin = g?.cabinProduct?.cabin || '';
      availabilityStatus = g?.cabinProduct?.avlStatus || '';
    }
    bookingClassDesignator = fareDetails.majCabin?.bookingClassDetails?.designator || '';

    // bookableTickets: try avlStatus or paxFareNum
    let bookableTickets = 0;
    if (availabilityStatus && !isNaN(Number(availabilityStatus))) {
      bookableTickets = Number(availabilityStatus);
    } else if (paxFare.paxFareNum && !isNaN(Number(paxFare.paxFareNum))) {
      bookableTickets = Number(paxFare.paxFareNum);
    }

    // Passenger counts
    let adults = 0, children = 0, infants = 0;
    const paxRef = rec.paxFareProduct?.paxReference;
    const ptc = paxRef?.ptc;
    const travellerArr = ensureArray(paxRef?.traveller);
    if (ptc === 'ADT') adults = travellerArr.length || 1;
    if (ptc === 'CHD') children = travellerArr.length || 1;
    if (ptc === 'INF') infants = travellerArr.length || 1;

    // passengerPrices array
    const passengerPrices = [];
    if (ptc) {
      passengerPrices.push({
        travelerType: ptc,
        price: {
          total: paxFare.totalFareAmount || '',
          base: '',
          currency: currency,
        },
      });
    }

    // Pricing messages
    const faresArr = ensureArray(rec.paxFareProduct?.fare);
    const pricingMessages = faresArr
      .map((f) => {
        if (f.pricingMessage) {
          const descArr = ensureArray(f.pricingMessage);
          return descArr.map((pm) => ensureArray(pm.description)).flat();
        }
        return [];
      }).flat();

    // Total price
    const totalPrice = paxFare.totalFareAmount || '';

    return {
      amadeusId: rec.itemNumber?.itemNumberId?.number || String(idx + 1),
      currency,
      price: totalPrice,
      taxes: paxFare.totalTaxAmount || '',
      ticketType: paxFare.pricingTicketing?.priceType || '',
      passengerType: ptc || '',
      passengerCount: travellerArr.length || 1,
      adults,
      children,
      infants,
      passengerPrices,
      segments,
      fareBasis,
      fareType,
      cabin,
      travelClass,
      bookingClass,
      bookingClassDesignator,
      availabilityStatus,
      bookableTickets,
      codeShare: paxFare.codeShareDetails?.company || '',
      pricingMessages,
      lastTicketDate: pricingMessages.find((msg) => typeof msg === 'string' && msg.includes('LAST TKT DTE')) || '',
      nonRefundable: pricingMessages.some((msg) => typeof msg === 'string' && msg.includes('NON-REFUNDABLE')),
      fareValidForETicket: pricingMessages.some((msg) => typeof msg === 'string' && msg.includes('E TICKET')),
      tripType,
    };
  });
}
