"use client"

import React  from "react";
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";

function BookSpace(){
    const currentLocation = useAuthStore((state) => state.currentLocation)
    const bookingLocation = useAuthStore((state) => state.bookingLocationDetails)
    const handleBookSpaceClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // this function here will extract the coordinates of the current and the destination location form the zustand store and will make a url request to the google maps for the direction 
        e.preventDefault()
        // this is the template url that you have to configure        
        window.location.href = `https://google.com/maps/dir/?api=1&origin=${currentLocation?.latitude},${currentLocation?.longitude}&destination=${bookingLocation?.latitude},${bookingLocation?.longitude}&travelmode=driving` 
    }

    return (
    <div className="flex justify-center items-center flex-col h-lvh bg-gray-700">
        <h1 className="text-white m-2 p-3 text-3xl ">Book Space</h1>
        <div className=" bg-black w-100 h-lvh p-2 rounded-lg">

            <FieldGroup>
            <Field>
                <FieldLabel htmlFor="fieldgroup-name" className="text-white">Name: {bookingLocation?.name}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-Date&Time:arrival" className="text-white">Set you arrival Time</FieldLabel>
                <Input
                id="fieldgroup-Date&Time:arrival"
                type="time"
                placeholder="set arrival time"
                />
                <FieldLabel htmlFor="fieldgroup-Date&Time:departure" className="text-white">Set you Departure Time</FieldLabel>
                <Input
                id="fieldgroup-Date&Time:departure"
                type="time"
                placeholder="set departure time"
                />

                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-white">Display the details of the vehicle here like license plate and car type</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-contactInfo" className="text-white">Display the contact details of the user</FieldLabel>
                
                <FieldLabel htmlFor="fieldgroup-payment-section" className="text-white">Display the payment options here</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-price" className="text-white">Display the total price of the parking space</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-payment-methods" className="text-white">Display the payment methods here like upi, credit/debit</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-confirm-and-pay-button" className="text-white">confirm the booking and pay the total amount</FieldLabel>
                
                
                
                <Input id="fieldgroup-name" placeholder="Jordan Lee" className="" />
            </Field>

            <Field>
                <FieldLabel htmlFor="fieldgroup-email" className="text-white">Email</FieldLabel>
                <Input
                id="fieldgroup-email"
                type="email"
                placeholder="name@example.com"
                />
            </Field>

            <Field orientation="horizontal">
                <Button type="reset" variant="outline" className="text-white">
                Reset
                </Button>
                <Button 
                type="submit"
                className="text-white bg-gray-500 hover:bg-gray-800"
                onClick={handleBookSpaceClick}
                >Book Space</Button>
                
            </Field>
            
            </FieldGroup>
        </div> 
    </div>
    )
}

export default BookSpace