import { BOOKING_STATUS } from "../booking/booking.interface"
import { Booking } from "../booking/booking.model"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { sslService } from "../sslCommerz/sslCommerz.service"
import { User } from "../user/user.model"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"

const successPaymentService = async(query : Record<string, string>)=>{
    const session = await Payment.startSession()
    session.startTransaction()
    try {
        const paymentRecord = await Payment.findOne({transactionId: query.transactionId})
        const updatePaymentStatus = await Payment.findByIdAndUpdate(paymentRecord?._id, {status: PAYMENT_STATUS.PAID}, {new: true, session})

        const updateBookingStatus = await Booking.findByIdAndUpdate(paymentRecord?.booking, {status: BOOKING_STATUS.COMPLETE},
            {new: true, session}
        )

        await session.commitTransaction()
        session.endSession()

        return {success: true, message: "payment success"}
    } catch (error) {
        session.abortTransaction()
        session.endSession()
        throw (error as Error).message
    }
}

const failPaymentService = async(query : Record<string, string>)=>{
const session = await Payment.startSession()
    session.startTransaction()
    try {
        const paymentRecord = await Payment.findOne({transactionId: query.transactionId})
        const updatePaymentStatus = await Payment.findByIdAndUpdate(paymentRecord?._id, {status: PAYMENT_STATUS.FAILED}, {new: true, session})

        const updateBookingStatus = await Booking.findByIdAndUpdate(paymentRecord?.booking, {status: BOOKING_STATUS.FAILED},
            {new: true, session}
        )

        await session.commitTransaction()
        session.endSession()

        return {success: false, message: "payment fail"}
    } catch (error) {
        session.abortTransaction()
        session.endSession()
        throw (error as Error).message
    }
}

const cancelPaymentService = async(query : Record<string, string>)=>{
const session = await Payment.startSession()
    session.startTransaction()
    try {
        const paymentRecord = await Payment.findOne({transactionId: query.transactionId})
        const updatePaymentStatus = await Payment.findByIdAndUpdate(paymentRecord?._id, {status: PAYMENT_STATUS.CANCELLED}, {new: true, session})

        const updateBookingStatus = await Booking.findByIdAndUpdate(paymentRecord?.booking, {status: BOOKING_STATUS.CANCEL},
            {new: true, session}
        )

        await session.commitTransaction()
        session.endSession()

        return {success: false, message: "payment cancel"}
    } catch (error) {
        session.abortTransaction()
        session.endSession()
        throw (error as Error).message
    }
}

const rePaymentService = async(bookingId: string)=>{

    const session = await Booking.startSession()
    session.startTransaction()
    try {
        const booking = await Booking.findById(bookingId)
        const user = await User.findById(booking?.user)
        const payment = await Payment.findById(booking?.payment)
    
        const userAddress = user?.address as string
        const userEmail = user?.email as string
        const userPhoneNumber = user?.phone as string
        const userName = user?.name as string
        
        const sslPayload : ISSLCommerz = {
            name: userName,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            address: userAddress,
            amount: payment?.amount as number,
            transactionId: payment?.transactionId as string
        }
        
        const sslPayment = await sslService.sslPaymentInit(sslPayload)

        await session.commitTransaction()
        session.endSession()
        return {
            paymentUrl: sslPayment.GatewayPageURL,
        }   

    } catch (error) {
        session.abortTransaction()
        session.endSession()
        throw (error as Error).message
    }

    
}

export const paymentServices = {
    successPaymentService,
    failPaymentService,
    cancelPaymentService,
    rePaymentService
}