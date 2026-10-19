// this is the middleware file which will handle access to the private and public routes in this application 
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "next/dist/server/api-utils";
import jwt, { JwtPayload } from "jsonwebtoken"

export async function proxy(request: NextRequest) { 
  try {
      const accessToken = request.cookies.get("accessToken")
      if (!accessToken) {
        return NextResponse.redirect(new URL("/login", request.url))    
      }
      const accessTokenValue = accessToken?.value
      // the jwt.verify either returns a stirng or a jwtPayload so after verifying the jwt the typeStript throws an error as we have not specified here whether decoded token is a string or a jwtpayload 
      const decodedToken = jwt.verify(accessTokenValue!, process.env.ACCESS_TOKEN_SECRET!, {algorithms: ['HS256']}) as JwtPayload
      // we can also throw an error here if the decoded token is a string 
      if (typeof decodedToken === "string") {
          throw new ApiError(400, "Invalid Token Payload")
      }        
      
      return NextResponse.next()

  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      console.log("The token has been expired");
      console.log(request.url);
      return NextResponse.redirect(new URL(`/api/refresh?redirect=${request.nextUrl.pathname}`, request.url)) // here we are sending the user to the http://localhost:3000/api/refresh in which the http"//localhost:3000 is the request.url which from which we hit this middleware 
    }
    return NextResponse.redirect(new URL("/login", request.url)) // for other kinds of jwt errors it is safe to fallback to the login page and force the user to login again  
  }

}
 
// here define all the routes where you want to run the middleware and in the above code 
export const config = {
  matcher: [
    '/',
    '/logout',
    '/booking',
    '/login',
    '/profile',
    '/registerUser',
    '/space-registration',
  ],
}