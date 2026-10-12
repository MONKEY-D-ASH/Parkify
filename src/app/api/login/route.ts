import { connect } from "@/models/dbConfig";
import User from "@/models/user.collection"
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { ApiError } from "next/dist/server/api-utils";

connect()

const generateAccessAndRefreshTokens = async function(userId: string){
    const user = await User.findById(userId)
    
    if (!user) {
        throw new ApiError(404, "There is an error while finding the user")
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}
}

export async function POST(request: NextRequest){
    try {        
        const reqBody = await request.json()
        const { email, password } = reqBody;
        
        // check if user exists or not 
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        
        // check if the password is correct or not 
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return NextResponse.json({error: "The password is incorrect"}, {status: 430})
        }
        
        // generate the access and the refresh token and encrypting them and storing them inside the browser cookies 
        // create token data
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
        
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry")
        if (!loggedInUser) {
            throw new ApiError(404, "Logged In user not found")
        }
        
        // the built in Nextjs NextResponse object has the access to the cookies of the user browser and we can set and get the cookies 
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            user: loggedInUser
        }) 
        // we are setting the cookies on the browser and this method takes three paramters: name, value and options   
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            path: "/"
        })
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/"
        })
        return response;

    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

// NOTE: HOW TO JWT TOKEN WORKS 

        // the jwt token comprises of three parts the header (containing the algorithm to be used and the type of the token which is the jwt) , the payload (it is a JSON object containing the actual core data referred to as claims (standard and custom claims)), the signature ( it is the thing that the server compares to check if the token is valid or not)

        // WORKING -
        // the header and the payload and encoded using the algorithm , To generate the final part of the JWT (the Signature), the server takes the encoded header, adds a dot, adds the encoded payload, and passes that entire combination along with your Secret Key through the hashing algorithm specified in the header.
        // When everything is assembled, the resulting string looks like this: hhhhhh.pppppp.ssssss.

        // HOW THE SERVER DECODES THE TOKEN -
        // The Server Decodes: The server splits the incoming token by the dots. It reads the header and payload to see who the user is.
        // The Server Re-Calculates: Using its private Secret Key, the server independently runs the exact same formula again: hashing the received header and payload together.
        // The Server Compares: It compares its newly calculated signature against the signature string sent by the client.
        // If they match: The server knows the token is authentic and unchanged.
        // If they do not match: If a user changes their role from "user" to "admin" in the payload, the server's calculated signature will completely mismatch the token's signature. The server will immediately catch the tampering and throw a 403 Forbidden error
