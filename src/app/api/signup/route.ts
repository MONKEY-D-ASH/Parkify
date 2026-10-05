import {connect} from "@/models/db.config"
import User from "@/models/user.collection"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {username, email, password, phoneNumber, role, address} = reqBody
        console.log(reqBody);

        // finding if the user already exists in the database or not 
        const user = await User.findOne({email})
        if (user) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        // encrypting the password before storing it 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            address
        })

        const savedUser = newUser.save()
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