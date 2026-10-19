import { connect } from "@/models/dbConfig";
import User from "@/models/user.collection"
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "next/dist/server/api-utils";
import jwt, { JwtPayload } from "jsonwebtoken"

connect()

export async function GET(request: NextRequest){
    try {
        const accessToken = request.cookies.get("accessToken")
        const accessTokenValue = accessToken?.value
        // the jwt.verify either returns a stirng or a jwtPayload so after verifying the jwt the typeStript throws an error as we have not specified here whether decoded token is a string or a jwtpayload 
        const decodedToken = jwt.verify(accessTokenValue!, process.env.ACCESS_TOKEN_SECRET!, {algorithms: ['HS256']}) as JwtPayload
        // we can also throw an error here if the decoded token is a string 
        if (typeof decodedToken === "string") {
            throw new ApiError(400, "Invalid Token Payload")
        }
        const user = await User.findById(decodedToken._id)
        if (!user) {
            throw new ApiError(400, "User not found")
        }
        user.refreshToken = ""
        await user.save()

        return NextResponse.json({
            message: "Logout Successful",
            success: true,
        }, {status: 200})

    } catch (error: any) {
        const status  = error instanceof ApiError? error.statusCode : 500
        const message = error instanceof ApiError? error.message : "Internal Server Error"
        return NextResponse.json({error: message}, {status: status})
    }
}