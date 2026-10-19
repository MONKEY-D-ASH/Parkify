import  {connect}  from "@/models/dbConfig"
import User from "@/models/user.collection"
import Car from "@/models/car.collection"
import { NextRequest, NextResponse } from "next/server"
import { ApiError } from "next/dist/server/api-utils"

connect()

export async function POST(request: NextRequest){
    try {        
        const reqBody = await request.json()
        const {username, email, password, phoneNumber, role, address, license, carModel, carColor, carType} = reqBody
        console.log(reqBody);

        const user = await User.findOne({email})
        if (user) {
            throw new ApiError(400, "User already exists")
        }
        
        const newCar = new Car({
            license: license,
            carModel: carModel,
            carColor: carColor,
            carType: carType
        })
        const savedCar = await newCar.save()
        
        const newUser = new User({
            username: username,
            email: email,
            // this password will be hashed during the save prehook we defined in the userSchema in the user.collection.js 
            password: password,
            phoneNumber: phoneNumber,
            role: role,
            address: address,
            carId: savedCar._id,
        })
        const savedUser = await newUser.save()

        return NextResponse.json({
            message: "User created successfully",
            success: true,
        },{status: 200})
        

    } catch (error: any) {
        const status = error instanceof ApiError? error.statusCode : 500
        const message = error instanceof ApiError? error.message : "Internal Server Error"
        return NextResponse.json({error: message}, {status: status})
    }
}