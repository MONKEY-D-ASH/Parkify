// this is the middleware file which will handle access to the private and public routes in this application 

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

  // intercept the request and decode it and then check if the access token is expired or not , if yes then return the response with the 401 status which will be intercepted by the axios interceptor and will generate the 

  return NextResponse.next()
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: ['/test-db'],
}