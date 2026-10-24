// write the booking logic here, simply take the details of the booking from the frontend and then create a document and then set the id of the booking in the user document
import  {connect}  from "@/models/dbConfig"
import ParkingSpace from "@/models/parking_space.collection"
import Booking from "@/models/booking.collection"
import { NextRequest, NextResponse } from "next/server"
import { ApiError } from "next/dist/server/api-utils"
import mongoose from "mongoose"

connect()

export async function POST(request: NextRequest){
    try {
        console.log("entering the api route");
        const reqBody = await request.json()        
        console.log(reqBody);

        const {address, latitude, longitude, price_per_hour, arrivalTime, departureTime, totalPrice} = reqBody
        console.log(typeof arrivalTime);
        console.log(typeof departureTime);
        const userId = new mongoose.Types.ObjectId(reqBody.userId)
        const carId = new mongoose.Types.ObjectId(reqBody.carId)

        console.log("creating a new space doc");
        const newSpace = new ParkingSpace({
            address: address,
            latitude: latitude,
            longitude: longitude,
            pricePerHour: price_per_hour,
            availabilityStatus: true
        })

        console.log("saving space doc");
        const savedSpace = await newSpace.save()
        console.log(savedSpace);
        console.log(savedSpace._id);

        console.log("creating a new booking doc");
        const newBooking = new Booking({
            userId: userId,
            carId: carId,
            spaceId: savedSpace._id,
            startTime: arrivalTime,
            endTime: departureTime,
            totalPrice: totalPrice,
            status: "active"
        })
        
        const savedBooking = await newBooking.save()
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