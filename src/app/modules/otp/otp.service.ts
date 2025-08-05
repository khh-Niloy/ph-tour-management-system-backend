import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
const OTP_EXPIRATION = 2 * 60 // 2minute

const generateOTP = (length = 6)=>{
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString()
}

const sendOTPService = async (email: string, name: string) => {

    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("User not found")
    }

    if (user.isVerified) {
        throw new Error("You are already verified")
    }
    const otp = generateOTP();

    const redisKey = `otp:${email}`

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }
    })
};

const verifyOTPService = async (email: string, otp: string) => {
    // const user = await User.findOne({ email, isVerified: false })
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("User not found")
    }

    if (user.isVerified) {
        throw new Error("You are already verified")
    }

    const redisKey = `otp:${email}`

    const savedOtp = await redisClient.get(redisKey)

    if (!savedOtp) {
        throw new Error("Invalid OTP");
    }

    if (savedOtp !== otp) {
        throw new Error("Invalid OTP");
    }

    await Promise.all([
        User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redisClient.del([redisKey])
    ])

};

export const OTPService = {
    sendOTPService,
    verifyOTPService
}