// handle the getCurrentLocation route of the user after login and then set the current latitude and the longitude of the user inside the zustand authstore 

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
        return;
    }

    // requesting the current location of the user 
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(latitude, longitude);
        const data = {latitude, longitude}
        

        if (latitude !== null && longitude !== null) {
            return NextResponse.json(
            data,
            {
                status: 200
            }
        )
        }
    }),
    
    (error: any) => {
        console.log(error);
        return NextResponse.json(
        {
            error: error?.message || "there is an error while setting the user current location"
        },
        {
            status: error?.status || error?.code || 500
        }
    )
    }
}