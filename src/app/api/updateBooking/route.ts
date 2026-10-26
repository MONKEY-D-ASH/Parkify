// write the booking logic here, simply take the details of the booking from the frontend and then create a document and then set the id of the booking in the user document
import  {connect}  from "@/models/dbConfig"
import User from "@/models/user.collection"
import Booking from "@/models/booking.collection"
import { NextRequest, NextResponse } from "next/server"
import { ApiError } from "next/dist/server/api-utils"
import mongoose from "mongoose"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()        
        const {userId, bookingId, action} = reqBody

        if (action === "cancel") {
            await User.findByIdAndUpdate(userId, {
                $pull: { bookingId: bookingId}
            })
            await Booking.findByIdAndDelete(bookingId)
        }else {
            await Booking.findByIdAndUpdate(bookingId, {
                $set: { status: "completed"}
            })
        }
        return NextResponse.json({
            message: `Booking ${(action === "cancel")? "cancelled" : "completed"} Successfully`,
            success: true,
        },{status: 200})

    } catch (error: any) {
        console.log(error);
        const status = error instanceof ApiError? error.statusCode : 500
        const message = error instanceof ApiError? error.message : "Internal Server Error from Update Booking route"
        return NextResponse.json({error: message}, {status: status})
    }
}