// write the booking logic here, simply take the details of the booking from the frontend and then create a document and then set the id of the booking in the user document
import  {connect}  from "@/models/dbConfig"
import User from "@/models/user.collection"
import Car from "@/models/car.collection"
import ParkingSpace from "@/models/parking_space.collection"
import Booking from "@/models/booking.collection"
import { NextRequest, NextResponse } from "next/server"
import { ApiError } from "next/dist/server/api-utils"
import mongoose from "mongoose"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()        
        console.log(reqBody);

        const {userId, carId, address, latitude, longitude, price_per_hour, arrivalTime, departureTime, totalPrice} = reqBody
        const user = await User.findById(userId)
        const userCar = await Car.findById(carId)

        
        const newSpace = new ParkingSpace({
            address: address,
            latitude: latitude,
            longitude: longitude,
            pricePerHour: price_per_hour,
            availabilityStatus: true
        })
        const savedSpace = await newSpace.save()

        const newBooking = new Booking({
            userId: user._id,
            carId: userCar._id,
            spaceId: savedSpace._id,
            startTime: arrivalTime,
            endTime: departureTime,
            totalPrice: totalPrice,
            status: "active"
        })
        
        const savedBooking = await newBooking.save()
        console.log("printing the saved booking");
        console.log(savedBooking);

        return NextResponse.json({
            message: "Booking created successfully",
            success: true,
            savedBooking,
        },{status: 200})

    } catch (error: any) {
        console.log(error);
        const status = error instanceof ApiError? error.statusCode : 500
        const message = error instanceof ApiError? error.message : "Internal Server Error"
        return NextResponse.json({error: message}, {status: status})
    }
}