import express from "express";
import { FlightController } from "../controllers/flightController";
import { verifyUserToken } from "../middlewares/verifyUserToken";
// You can create validators as needed

const flightRouter = express.Router();

flightRouter
  .route("/")
  .get(verifyUserToken, FlightController.getAllFlights)
  .post(verifyUserToken, FlightController.createFlight);

flightRouter
  .route("/:id")
  .get(FlightController.getFlightById)
  .put(verifyUserToken, FlightController.updateFlight)
  .delete(verifyUserToken, FlightController.deleteFlight);

export default flightRouter;