import { body } from "express-validator";

export const createFlightValidator = [
  body("flightNumber").exists().trim().escape(),
  body("airline").exists().trim().escape(),
  body("origin").exists().trim().escape(),
  body("destination").exists().trim().escape(),
  body("departureTime").exists().isISO8601().toDate(),
  body("arrivalTime").exists().isISO8601().toDate(),
  body("duration").exists().isNumeric(),
  body("price").exists().isNumeric(),
];