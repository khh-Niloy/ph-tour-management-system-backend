import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../auth/auth.routes";
import { divisionRoutes } from "../modules/division/division.routes";
import { tourRoutes } from "../modules/tour/tour.routes";
import { bookingRoutes } from "../modules/booking/booking.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { otpRoutes } from "../modules/otp/otp.routes";

export const routes = Router();

const allRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/division",
    route: divisionRoutes,
  },
  {
    path: "/tour",
    route: tourRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
];

allRoutes.forEach(({ path, route }) => routes.use(path, route));
