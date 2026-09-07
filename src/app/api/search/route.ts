// here we will define a route for the search of the location 

import { db, parkingSpaceCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request: NextRequest){
    try {
        const {data} = await request.json()        
        const response = await databases.listDocuments(db, parkingSpaceCollection, [
            Query.equal("name", data)
        ])
        const testData = response.documents[0]
        
        return NextResponse.json(
            {
                data: testData
            },
            {
                status: 200
            }
        )

    } catch (error: any) {
        return NextResponse.json(
        {
            message: error?.message || "there is an error while handling the search"
        },
        {
            status: error?.status || error?.code || 500
        }
    )
    }
}