

import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "next/dist/server/api-utils";
import ParkingSpace from "@/models/parking_space.collection";
import User from "@/models/user.collection";

export async function POST(request: NextRequest){
    try {        
        const reqBody = await request.json()    
        const {userId, address, price_per_hour, availabilityStatus} = reqBody     
        const user = await User.findById(userId)
           
        if (user.spaceId !== undefined ) {
            const userSpace = await ParkingSpace.findById(user.spaceId)
            console.log(userSpace);
            return NextResponse.json({
            userSpace: userSpace
            },
            {
            status: 200
            }
        )
        }
                
        const params = new URLSearchParams({
            addressdetails: "1",
            q: address,
            format: "jsonv2",
            limit: "1"
        })
        
        const OSMResponse  = await fetch(`https://nominatim.openstreetmap.org/search?addressdetails=1&q=${params.toString()}`,{
            headers:{
                "User-Agent": "parkify-app/1.0 (aashishkumarrana17@gmail.com)"
            }
        })

        const responseData = await OSMResponse.json()
        if (responseData.length === 0 ) {
            throw new ApiError(400, "Enter a valid address for registration")
        }
        console.log(responseData);
        
        const latitude = responseData[0].lat
        const longitude = responseData[0].lon

        const userSpace = new ParkingSpace({
            address: address,
            latitude: latitude,
            longitude: longitude,
            pricePerHour: price_per_hour,
            availabilityStatus: availabilityStatus
        })
        const savedUserSpace = await userSpace.save()  
              
        user.spaceId = savedUserSpace._id
        user.role = "provider"
        const savedUser = await user.save()
        console.log(savedUser);
        
    
        return NextResponse.json({
            userSpace: {userSpace}
            },
            {
            status: 200
            }
    )
    
    } catch (error: any) {
        console.log(error);
        const message = error instanceof ApiError? error.message : "Internal Server Error"
        const status = error instanceof ApiError? error.statusCode : 500
        return NextResponse.json({error: message},{status: status})
    }
}