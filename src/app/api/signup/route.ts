import  {connect}  from "@/models/dbConfig"
import User from "@/models/user.collection"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

connect()

export async function POST(request: NextRequest){
    try {
        console.log("entering the signup api");
        
        const reqBody = await request.json()
        const {username, email, password, phoneNumber, role, address} = reqBody
        console.log(reqBody);

        console.log("finding if the user already exists in the database or not") 
        const user = await User.findOne({email})
        if (user) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }
 
        console.log("encrypting the password before storing it");
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        console.log("creating the new user");
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
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