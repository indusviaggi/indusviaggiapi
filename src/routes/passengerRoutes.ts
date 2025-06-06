import express from "express";
import { PassengerController } from "../controllers/passengerController";
import { verifyUserToken } from "../middlewares/verifyUserToken";
import { createPassengerValidator } from "../validators/passenger.validator";
import { validateRequest } from "../middlewares/validateRequest";

const passengerRouter = express.Router();

passengerRouter
  .route("/")
  .get(verifyUserToken, PassengerController.getAllPassengers)
  .post(
    verifyUserToken,
    createPassengerValidator,
    validateRequest,
    PassengerController.createPassenger
  );

passengerRouter
  .route("/:id")
  .get(verifyUserToken, PassengerController.getPassengerById)
  .put(
    verifyUserToken,
    createPassengerValidator,
    validateRequest,
    PassengerController.updatePassenger
  )
  .delete(verifyUserToken, PassengerController.deletePassenger);

export default passengerRouter;