import express from "express";
import { FlightController } from "../controllers/flightController";
import { verifyUserToken } from "../middlewares/verifyUserToken";
import { createFlightValidator } from "../validators/flight.validator";
import { validateRequest } from "../middlewares/validateRequest";

const flightRouter = express.Router();

flightRouter
  .route("/")
  .get(verifyUserToken, FlightController.getAllFlights)
  .post(
    verifyUserToken,
    createFlightValidator,
    validateRequest,
    FlightController.createFlight
  );

flightRouter
  .route("/:id")
  .get(verifyUserToken, FlightController.getFlightById)
  .put(
    verifyUserToken,
    createFlightValidator,
    validateRequest,
    FlightController.updateFlight
  )
  .delete(verifyUserToken, FlightController.deleteFlight);

export default flightRouter;