import  {connect}  from "@/models/dbConfig"
import ParkingSpace from "@/models/user.collection"
import { NextRequest, NextResponse } from "next/server"

connect()

export async function POST(request: NextRequest){
    try {        
        const reqBody = await request.json()    
        const {data} = reqBody // this is the text that is entered in the search field 
        const params = new URLSearchParams({
            addressdetails: "1",
            q: data,
            format: "jsonv2",
            limit: "1"
        })
        
        const OSMResponse  = await fetch(`https://nominatim.openstreetmap.org/search?addressdetails=1&q=${params.toString()}`,{
            headers:{
                "User-Agent": "parkify-app/1.0 (aashishkumarrana17@gmail.com)"
            }
        })

        const responseData = await OSMResponse.json()
        console.log(responseData);
        
        const latitude = responseData[0].lat
        const longitude = responseData[0].lon
        const name = responseData[0].name     

        return NextResponse.json({
            data: {latitude, longitude,name}
            },
            {
            status: 200
            }
    )
    
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