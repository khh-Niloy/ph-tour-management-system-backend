import { Router } from "express";
import { bookingController } from "./booking.controller";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";
import { Role } from "../user/user.interface";
import { validateSchema } from "../../middleware/zodValidate";
import { createBookingZodSchema } from "./booking.validation";

export const bookingRoutes = Router()

bookingRoutes.post("/",roleBasedProtection(...Object.values(Role)), validateSchema(createBookingZodSchema), bookingController.createBooking)