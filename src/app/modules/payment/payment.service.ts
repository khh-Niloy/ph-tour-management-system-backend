import { uploadBufferToCloudinary } from "../../config/cloudinary.config"
import { generatePdf, IInvoiceData } from "../../utils/invoice"
import { sendEmail } from "../../utils/sendEmail"
import { BOOKING_STATUS } from "../booking/booking.interface"
import { Booking } from "../booking/booking.model"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { sslService } from "../sslCommerz/sslCommerz.service"
import { ITour } from "../tour/tour.interface"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"

const successPaymentService = async(query : Record<string, string>)=>{
    const session = await Payment.startSession()
    session.startTransaction()
    try {
        const paymentRecord = await Payment.findOne({transactionId: query.transactionId})
        const updatedPayment = await Payment.findByIdAndUpdate(paymentRecord?._id, {status: PAYMENT_STATUS.PAID}, {new: true, session})

        if(!updatedPayment){
            throw new Error("Booking not found")
        }

        const updatedBooking = await Booking.findByIdAndUpdate(paymentRecord?.booking, {status: BOOKING_STATUS.COMPLETE},
            {new: true, session}
        )
        .populate("tour", "title")
        .populate("user", "name email")

        if (!updatedBooking) {
            throw new Error("Booking not found")
        }

        const invoiceData: IInvoiceData = {
            bookingDate: updatedBooking.createdAt as Date,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment.amount,
            tourTitle: (updatedBooking.tour as unknown as ITour).title,
            transactionId: updatedPayment.transactionId,
            userName: (updatedBooking.user as unknown as IUser).name
        }
        const pdfBuffer = await generatePdf(invoiceData)

        const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice")

        if (!cloudinaryResult) {
            throw new Error("Error uploading pdf")
        }

        await Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: cloudinaryResult.secure_url }, { runValidators: true, session })


        await sendEmail({
            to: (updatedBooking.user as unknown as IUser).email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        })

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