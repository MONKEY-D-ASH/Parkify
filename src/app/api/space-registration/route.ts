// this is a simple route that will handle the space- registration functionality of the application and here the name of the place will be provided from the frontend and then an api call to the nominatim api service will be made in the following something format like ( https://nominatim.openstreetmap.org/search?q=Malviya+Nagar,+Delhi&format=json&addressdetails=1&limit=1) which will provied the latide and the longitude of the name of the palce that the user has entered from the frontend and then here the database call will be made to register that location in the parking_space collection 

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const {name, state} = await request.json()
        const newName = name.trim().replaceAll(" ", "+")
        const newState = state.trim()
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${newName},+${newState}&format=json&addressdetails=1&limit=1`)
        console.log("this is the api response from openstreetmap");
        console.log(response);

        return NextResponse.json(
            {
                message: "space is registered successfully"
            },
            {
                status: 200
            }
        )
    } catch (error: any) {
        return NextResponse.json(
            {
                message: error?.message || "there is an error while registring the parking space"
            },
            {
                status: error?.status || error?.code || 570
            }
        )
    }
}