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
import toast from "react-hot-toast";
import axios from "axios";

function BookSpace(){
    const currentLocation = useAuthStore((state) => state.currentLocation)
    const bookingLocationDetails = useAuthStore((state) => state.bookingLocationDetails)
    const userCar = useAuthStore((state) => state.userCar)
    const user = useAuthStore((state) => state.user)
    const [isLoading, setIsLoading] = React.useState(false)
    const [showGetDirection, setshowGetDirection] = React.useState(false)
    const [bookingDetails, setbookingDetails] = useState({
        arrivalTime: "",
        departureTime: "",
        totalPrice: 0 
    })

    const setPrice = () => {
        console.log(bookingDetails);  
        const arrivalTime = Number(bookingDetails.arrivalTime.replace(":", ""));  
        const departureTime = Number(bookingDetails.departureTime.replace(":", ""));  
        var totalPrice;

        if (Math.floor(arrivalTime/100) < Math.floor(departureTime/100)) {
            const totalHours = Math.floor(departureTime/100) - Math.floor(arrivalTime/100) - 1             
            const totalMinutes =  (60 - arrivalTime%100) + (departureTime%100)
            const totalHoursForPriceCalculation = totalHours + (totalMinutes/60)
            const price = totalHoursForPriceCalculation * bookingLocationDetails!.price_per_hour
            totalPrice = Number(price.toFixed(2))
            setbookingDetails({...bookingDetails, totalPrice: totalPrice})
            
        } else if (Math.floor(arrivalTime/100) > Math.floor(departureTime/100)) {
            const totalHours = 23 - Math.floor(arrivalTime/100) + Math.floor(departureTime/100)
            const totalMinutes = (departureTime%100) + (60 - arrivalTime%100)
            const totalHoursForPriceCalculation = totalHours + (totalMinutes/60)
            const price = totalHoursForPriceCalculation * bookingLocationDetails!.price_per_hour
            totalPrice = Number(price.toFixed(2))
            setbookingDetails({...bookingDetails, totalPrice: totalPrice})
        }
    }   

    const bookParkingSpace = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // take the details of the space that you are booking which includes (address, latitude, longitude, pricePerHour, availabilityStatus) to create a space document 
        // take the details of the booking to create a booking under the user's id that includes (userId(from zustand store), carId(zustand store), spaceId(from the document you create in the api route), startTime, endTime, totalPrice, status)

        // in the api route first create the parking space document and then take it's id and then create the booking document under the userId and then redirect the user to the profile page where he can see his profile and a section for the active bookings he has 

         if (!bookingDetails.arrivalTime || !bookingDetails.departureTime) {
            toast.error("please set the arrival and the departure time")
            return 
        }

        if (bookingDetails.arrivalTime.length !== 0 && bookingDetails.departureTime.length !== 0 && bookingDetails.totalPrice !== 0) {       
            try {
                const data = {
                    userId: user?._id,
                    address: bookingLocationDetails?.name,
                    latitude: bookingLocationDetails?.latitude,
                    longitude: bookingLocationDetails?.longitude,
                    price_per_hour: bookingLocationDetails?.price_per_hour,
                    arrivalTime: bookingDetails.arrivalTime,
                    departureTime: bookingDetails.departureTime,
                    totalPrice: bookingDetails.totalPrice 
                }
                const response = await axios.post("./api/booking", data)
                console.log(response);
                toast.success("User Booking created successfully")
                setIsLoading(false)  
                setshowGetDirection(true)
                
            } catch (error: any) {
                if (error.response) {
                    toast.error("There is an error while booking the parking space", error.response.data.error);
                } else{
                    toast.error("Booking Failed")
                }
                setIsLoading(false)
            }

        }
    }

    const getDirection = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // redirecting the user to the google maps application to direct himself to the parking space
        window.location.href = `https://google.com/maps/dir/?api=1&origin=${currentLocation?.latitude},${currentLocation?.longitude}&destination=${bookingLocationDetails?.latitude},${bookingLocationDetails?.longitude}&travelmode=driving`
    }

    return (
    <div className="flex justify-center items-center flex-col min-h-lvh px-4 py-8 bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)]">
        <h1 className="text-white m-2 p-3 text-3xl font-semibold tracking-tight drop-shadow-sm">{isLoading? "Processing" : "Book Parking"}</h1>
        <div className="bg-white w-full max-w-md p-8 rounded-2xl border border-[#E2E8F0] shadow-[0_8px_24px_rgba(30,58,138,0.25)]">

            <FieldGroup>
            <Field>
                <FieldLabel htmlFor="fieldgroup-name" className="text-white font-semibold bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] rounded-lg px-3 py-2.5 shadow-sm">Destination: {bookingLocationDetails?.name}</FieldLabel>

                <FieldLabel htmlFor="fieldgroup-Date&Time:arrival" className="text-[#0F172A] font-medium mt-3">Set you arrival Time</FieldLabel>
                <Input
                className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                id="fieldgroup-Date&Time:arrival"
                type="time"
                placeholder="set arrival time"
                value={bookingDetails.arrivalTime}
                onChange={(e) => setbookingDetails({...bookingDetails, arrivalTime: e.target.value})}
                />
                <FieldLabel htmlFor="fieldgroup-Date&Time:departure" className="text-[#0F172A] font-medium mt-3">Set you Departure Time</FieldLabel>
                <Input
                className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                id="fieldgroup-Date&Time:departure"
                type="time"
                placeholder="set departure time"
                value={bookingDetails.departureTime}  
                onChange={(e) => setbookingDetails({...bookingDetails, departureTime: e.target.value})}
                />

                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-[#1E3A8A] font-semibold mt-4 border-b border-[#E2E8F0] pb-1">Car Details:</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-[#0F172A] font-normal bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg px-3 py-2">License: {userCar?.license}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-[#0F172A] font-normal bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg px-3 py-2">Type: {userCar?.carType}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-[#0F172A] font-normal bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg px-3 py-2">Model: {userCar?.carModel}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-[#0F172A] font-normal bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg px-3 py-2">Color: {userCar?.carColor}</FieldLabel>

                <FieldLabel htmlFor="fieldgroup-contactInfo" className="text-[#1E3A8A] font-semibold mt-4 border-b border-[#E2E8F0] pb-1">User Details:</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2">Name: {user?.username}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2">Phone: {user?.phoneNumber}</FieldLabel>
                <FieldLabel htmlFor="fieldgroup-vehicle details" className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2">Email: {user?.email}</FieldLabel>

                <Button 
                type="button" 
                className="w-full h-11 mt-4 bg-white text-[#1E3A8A] font-semibold border border-[#0891B2] hover:bg-[#ECFEFF] transition-colors"
                onClick={setPrice}>
                Calculate Price
                </Button>

                <FieldLabel htmlFor="fieldgroup-price" className="text-[#0F172A] text-lg font-semibold justify-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-3">Total Amount: ${bookingDetails.totalPrice}</FieldLabel>
                
                <Button 
                type="button" 
                className="w-full h-11 text-white font-semibold bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95 shadow-md transition-all"
                onClick={bookParkingSpace}>
                Book Parking Space
                </Button>

                {showGetDirection && (
                    <div>
                        <Button 
                        type="button" 
                        className="w-full h-11 text-white font-semibold bg-[#10B981] hover:bg-[#059669] shadow-md transition-colors"
                        onClick={getDirection}>
                        Get Direction
                        </Button>
                    </div>
                )}    

                <Link href={"/profile"} className="text-center text-sm font-semibold text-[#0891B2] hover:text-[#1E3A8A] hover:underline transition-colors mt-2 underline"> Go to Your Bookings</Link>


            </Field>
            </FieldGroup>
        </div> 
    </div>
    )
}

export default BookSpace