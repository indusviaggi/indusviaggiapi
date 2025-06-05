import express from "express";
import { BookingController } from "../controllers/bookingController";
import { verifyUserToken } from "../middlewares/verifyUserToken";

const bookingRouter = express.Router();

bookingRouter
  .route("/")
  .get(verifyUserToken, BookingController.getAllBookings)
  .post(verifyUserToken, BookingController.createBooking);

bookingRouter
  .route("/:id")
  .get(verifyUserToken, BookingController.getBookingById)
  .put(verifyUserToken, BookingController.updateBooking)
  .delete(verifyUserToken, BookingController.deleteBooking);

export default bookingRouter;