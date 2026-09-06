// this is the middleware file which will handle access to the private and public routes in this application 

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 import getOrCreateDB from './models/server/db.setup'
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  await Promise.all([
    getOrCreateDB()
  ])
  return NextResponse.next()
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: ['/test-db'],
}