"use client"

import React, {useEffect, useState}  from "react";
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
import { handleClientScriptLoad } from "next/script";

function BookSpace(){
    const currentLocation = useAuthStore((state) => state.currentLocation)
    const bookingLocationDetails = useAuthStore((state) => state.bookingLocationDetails)
    const userCar = useAuthStore((state) => state.userCar)
    const user = useAuthStore((state) => state.user)
    const [bookingDetails, setbookingDetails] = useState({
        arrivalTime: "",
        DepartureTime: "",
        totalPrice: 0 
    })

    const setPrice = () => {
        console.log(bookingDetails);  
        const arrivalTime = Number(bookingDetails.arrivalTime.replace(":", ""));  
        const departureTime = Number(bookingDetails.DepartureTime.replace(":", ""));  
        var totalPrice;

        if (Math.floor(arrivalTime/100) < Math.floor(departureTime/100)) {
            const totalHours = Math.floor(departureTime/100) - Math.floor(arrivalTime/100) - 1             
            const totalMinutes =  (60 - arrivalTime%100) + (departureTime%100)
            const totalHoursForPriceCalculation = totalHours + (totalMinutes/60)
            totalPrice = totalHoursForPriceCalculation * bookingLocationDetails!.price_per_hour
            setbookingDetails({...bookingDetails, totalPrice: totalPrice})
            
        } else if (Math.floor(arrivalTime/100) > Math.floor(departureTime/100)) {
            const totalHours = 23 - Math.floor(arrivalTime/100) + Math.floor(departureTime/100)
            const totalMinutes = (departureTime%100) + (60 - arrivalTime%100)
            const totalHoursForPriceCalculation = totalHours + (totalMinutes/60)
            totalPrice = totalHoursForPriceCalculation * bookingLocationDetails!.price_per_hour
            setbookingDetails({...bookingDetails, totalPrice: totalHoursForPriceCalculation})
        }
    }   

    const handleBookSpaceClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // this function here will extract the coordinates of the current and the destination location form the zustand store and will make a url request to the google maps for the direction 
        e.preventDefault()
        // this is the template url that you have to configure        
        window.location.href = `https://google.com/maps/dir/?api=1&origin=${currentLocation?.latitude},${currentLocation?.longitude}&destination=${bookingLocationDetails?.latitude},${bookingLocationDetails?.longitude}&travelmode=driving` 
    }

    return (
    <div className="flex justify-center items-center flex-col h-1vh bg-gray-700">
        <h1 className="text-white m-2 p-3 text-3xl ">Book Your parking Space</h1>
        <div className=" bg-black w-100 h-1vh p-5 mb-40 rounded-lg">

            <FieldGroup>
            <Field>
                <FieldLabel htmlFor="fieldgroup-name" className="text-white bg-green-600 border rounded-sm p-1">Destination: {bookingLocationDetails?.name}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-Date&Time:arrival" className="text-white">Set you arrival Time</FieldLabel>
                <Input
                className="text-white"
                id="fieldgroup-Date&Time:arrival"
                type="time"
                placeholder="set arrival time"
                value={bookingDetails.arrivalTime}
                onChange={(e) => setbookingDetails({...bookingDetails, arrivalTime: e.target.value})}
                />
                <FieldLabel htmlFor="fieldgroup-Date&Time:departure" className="text-white">Set you Departure Time</FieldLabel>
                <Input
                className="text-white"
                id="fieldgroup-Date&Time:departure"
                type="time"
                placeholder="set departure time"
                value={bookingDetails.DepartureTime}  
                onChange={(e) => setbookingDetails({...bookingDetails, DepartureTime: e.target.value})}
                />

                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-white">Car Details:</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-white bg-blue-600 border rounded-sm p-1">License: {userCar?.license}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-white bg-blue-600 border rounded-sm p-1">Type: {userCar?.carType}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-white bg-blue-600 border rounded-sm p-1">Model: {userCar?.carModel}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-white bg-blue-600 border rounded-sm p-1">Color: {userCar?.carColor}</FieldLabel>

                <FieldLabel htmlFor="fieldgroup-contactInfo" className="text-white">User Details:</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-white bg-red-500 border rounded-sm p-1">Name: {user?.username}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-white bg-red-500 border rounded-sm p-1">Phone: {user?.phoneNumber}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-white bg-red-500 border rounded-sm p-1">Email: {user?.email}</FieldLabel>

                <Button 
                type="button" 
                className="text-white bg-green-700 hover:bg-green-500"
                onClick={setPrice}>
                Calculate Price
                </Button>

                <FieldLabel htmlFor="fieldgroup-price" className="text-white">Total Amount: ${bookingDetails.totalPrice}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-payment-methods" className="text-white">Display the payment methods here like upi, credit/debit</FieldLabel>


{/* set the payment options if possible then confirm payment and then create a document of the user in the book collection and link it to the user's document id which you can extract from the access token in the request cookie */}


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