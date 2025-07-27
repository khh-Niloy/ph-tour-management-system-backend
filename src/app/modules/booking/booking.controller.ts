import { Request, Response } from "express"
import { bookingServices } from "./booking.service"
import { successResponse } from "../../utils/successResponse"
import { JwtPayload } from "jsonwebtoken"

const createBooking = async(req: Request, res: Response)=>{
    try {
        const jwt_user = req.user as JwtPayload
        const newBooking = await bookingServices.createBookingService(req.body, jwt_user.userId)

        successResponse(res, {
        statusCode: 201,
        success: true,
        message: "new booking created",
        data: newBooking,
    });
    } catch (error) {
        console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
    }
}

export const bookingController = {
    createBooking
    // getUserBooking,
    // getBookingById,
    // updateBookingStatus,
    // getAllBookings
}