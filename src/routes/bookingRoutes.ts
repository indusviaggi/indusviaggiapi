import express from "express";
import { BookingController } from "../controllers/bookingController";
import { verifyUserToken } from "../middlewares/verifyUserToken";

const bookingRouter = express.Router();

bookingRouter.get(
  "/user/:userId",
  verifyUserToken,
  BookingController.getBookingsByUser
);
bookingRouter.get(
  "/flight/:flightId",
  verifyUserToken,
  BookingController.getBookingsByFlight
);
bookingRouter.get(
  "/filterTimeSpan",
  verifyUserToken,
  BookingController.getBookingsByTimeSpan
);
bookingRouter.get(
  "/passenger/:passengerId",
  verifyUserToken,
  BookingController.getBookingsByPassenger
);

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