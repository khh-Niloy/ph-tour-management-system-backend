import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/successResponse";
import { OTPService } from "./otp.service";


const sendOTP = (async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name } = req.body
        await OTPService.sendOTPService(email, name)
    successResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: null,
    });
    } catch (error) {
        console.log(error)
        next(error)
    }
})

const verifyOTP = (async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;
    await OTPService.verifyOTPService(email, otp)
    successResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully",
        data: null,
    });
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export const OTPController = {
    sendOTP,
    verifyOTP
};