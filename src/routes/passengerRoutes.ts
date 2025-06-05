import express from "express";
import { PassengerController } from "../controllers/passengerController";
import { verifyUserToken } from "../middlewares/verifyUserToken";

const passengerRouter = express.Router();

passengerRouter
  .route("/")
  .get(verifyUserToken, PassengerController.getAllPassengers)
  .post(verifyUserToken, PassengerController.createPassenger);

passengerRouter
  .route("/:id")
  .get(verifyUserToken, PassengerController.getPassengerById)
  .put(verifyUserToken, PassengerController.updatePassenger)
  .delete(verifyUserToken, PassengerController.deletePassenger);

export default passengerRouter;