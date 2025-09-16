// src/modules/otp/otp.routes.ts
import express from "express";
import { OTPController } from "./otp.controller";

export const otpRoutes = express.Router();

otpRoutes.post("/send", OTPController.sendOTP);
otpRoutes.post("/verify", OTPController.verifyOTP);