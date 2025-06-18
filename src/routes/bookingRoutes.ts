import express from "express";
import { BookingController } from "../controllers/bookingController";
import { verifyUserToken } from "../middlewares/verifyUserToken";
import { createBookingValidator } from "../validators/booking.validator";
import { validateRequest } from "../middlewares/validateRequest";

const bookingRouter = express.Router();

bookingRouter.get(
  "/my",
  verifyUserToken,
  BookingController.getUserBookingsWithDetails
);

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

bookingRouter.post(
  "/full",
  verifyUserToken,
  BookingController.createBookingFull
);

bookingRouter
  .route("/")
  .get(verifyUserToken, BookingController.getAllBookings)
  .post(
    verifyUserToken,
    createBookingValidator,
    validateRequest,
    BookingController.createBooking
  );

bookingRouter.post(
  "/:id/status",
  verifyUserToken,
  BookingController.updateBookingStatus
);

bookingRouter
  .route("/:id")
  .get(verifyUserToken, BookingController.getBookingById)
  .put(
    verifyUserToken,
    createBookingValidator, // Add validator for update
    validateRequest,
    BookingController.updateBooking
  )
  .delete(verifyUserToken, BookingController.deleteBooking);

export default bookingRouter;