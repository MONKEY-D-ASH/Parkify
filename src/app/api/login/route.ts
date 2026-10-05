import { connect } from "@/models/db.config";
import User from "@/models/user.collection"
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

// you have to use this inside the route in which you are making a connection to the mongodb database
connect()

export async function POST(request: NextRequest){
    try {        
        const reqBody = await request.json()
        const { email, password } = reqBody;
        console.log(reqBody);
        
        // check if user exists or not 
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }

        // check if the password is correct or not 
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return NextResponse.json({error: "The password is incorrect"}, {status: 400})
        }

        // generate the access and the refresh token and encrypting them and storing them inside the browser cookies 
        // create token data

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

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        // this exclaimation at the end tells the typescript compiler to trust on us that this value will never be a null or undefind , it is called the Non-Null Assertion Operator in Typescript
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
        if(!token){
            return NextResponse.json({error: "There was an error while generating access token"})
        }

        // the built in Nextjs NextResponse object has the access to the cookies of the user browser and we can set and get the cookies 
        const response = NextResponse.json({
            message: "Login successful",
            success: true
        }) 
        // we are setting the cookies on the browser and this method takes three paramters: name, value and options   
        response.cookies.set("token", token, {
            httpOnly: true, // means this cookie cannot be accessed by the client-side javascript, it is a security flag
            path: "/" // the path field determine which path will be able to access and send this cookie in its http request, by setting the path "/" we can say that the cookie is available everywhere, if it was like "/admin" that means only the http requests starting with /admin can access and send this cookie in their http request
        })
        return response;

    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}