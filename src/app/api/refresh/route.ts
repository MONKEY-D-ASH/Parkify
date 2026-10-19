import { connect } from "@/models/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.collection";
import { ApiError } from "next/dist/server/api-utils";
import jwt, { JwtPayload } from "jsonwebtoken"

connect()
export async function GET(request: NextRequest){
    try {
        const refreshToken = request.cookies.get("refreshToken")?.value
        const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";     
        
        if(!refreshToken){
            return NextResponse.redirect(new URL("/login", request.url))
        }
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, {algorithms: ['HS256']}) as JwtPayload

        const user = await User.findById(decodedRefreshToken._id)
        const newAccessToken = await user.generateAccessToken()
        const newRefreshToken = await user.generateRefreshToken()

        const response = NextResponse.redirect(new URL(redirectUrl, request.url))
        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            path: "/",
            secure:true
        })
        response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            path: "/",
            secure:true
        })
        return response;

    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            console.log("Refresh Token has been expired");
        }
        return NextResponse.redirect(new URL("/login", request.url))
    }
}