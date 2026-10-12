import  {connect}  from "@/models/dbConfig"
import User from "@/models/user.collection"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

connect()

export async function POST(request: NextRequest){
    try {        
        const reqBody = await request.json()
        const {username, email, password, phoneNumber, role, address} = reqBody
        console.log(reqBody);

        const user = await User.findOne({email})
        if (user) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }
        
        const newUser = new User({
            username: username,
            email: email,
            // this password will be hashed during the save prehook we defined in the userSchema in the user.collection.js 
            password: password,
            phoneNumber: phoneNumber,
            role: role,
            address: address
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        },{status: 200})
        

    } catch (error: any) {
        return NextResponse.json(
        {
            error: error
        },
        {
            status: 500
        })
    }
}