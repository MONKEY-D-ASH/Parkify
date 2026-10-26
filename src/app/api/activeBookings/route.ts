import  {connect}  from "@/models/dbConfig"
import User from "@/models/user.collection"
import ParkingSpace from "@/models/parking_space.collection"
import Booking from "@/models/booking.collection"
import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()        
        const userId = reqBody.userId
        const user = await User.findById(userId)

        const responseData = await Booking.aggregate([
        { $match: 
            { 
            _id: {
                 $in: user.bookingId 
                } 
            } 
        },
        {
            $lookup: {
            from: "parkingspaces",
            localField: "spaceId",
            foreignField: "_id",
            as: "space"
            }
        },
        { $unwind: "$space" },
        {
            $project: {
            address: "$space.address",
            price_per_hour: "$space.pricePerHour",
            latitude: "$space.latitude",
            longitude: "$space.longitude",
            status: 1,
            startTime: 1,
            endTime: 1,
            totalPrice: 1
            }
        }
        ]);
        
        return NextResponse.json({
            message: "User Bookings fetched successfully",
            success: true,
            responseData,
        },{status: 200})

    } catch (error: any) {
        console.log(error);
        NextResponse.json({
            error: error!.message
        }, {status: error!.status})
    }
}