// handle the getCurrentLocation route of the user after login and then set the current latitude and the longitude of the user inside the zustand authstore 

import { useAuthStore } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const {setLocation} = useAuthStore()
    if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
        return;
    }

    // requesting the current location of the user 
    navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (latitude !== null && longitude !== null) {
            setLocation({latitude, longitude})
            return NextResponse.json(
            {latitude, longitude},
            {
                status: 200
            }
        )
        }
    }),
    
    (error: any) => {
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