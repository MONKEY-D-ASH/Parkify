import  {connect}  from "@/models/dbConfig"
import ParkingSpace from "@/models/parking_space.collection"
import Booking from "@/models/booking.collection"
import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()        
        const Id = reqBody.userId
        
        const userBooking = await Booking.findOne({userId: Id})
        console.log("printing the booking of the user");
        console.log(userBooking);

        const spaceId = userBooking.spaceId
        const userSpace = await ParkingSpace.findById(spaceId)
        console.log("printing the space the user has booked");
        console.log(userSpace);

        const responseData = {
            address: userSpace.address,
            price_per_hour: userSpace.pricePerHour,
            status: userBooking.status,
            startTime: userBooking.startTime,
            endTime: userBooking.endTime,
            totalPrice: userBooking.totalPrice
        }
        console.log("printing the response data");
        console.log(responseData);
        
        return NextResponse.json({
            message: "User Bookings fetched successfully",
            success: true,
            data: responseData,
        },{status: 200})

    } catch (error: any) {
        console.log(error);
        NextResponse.json({
            error: error!.message
        }, {status: error!.status})
    }
}