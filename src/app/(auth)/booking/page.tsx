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
            totalPrice = totalHoursForPriceCalculation * bookingLocationDetails!.price_per_hour
            setbookingDetails({...bookingDetails, totalPrice: totalPrice})
            
        } else if (Math.floor(arrivalTime/100) > Math.floor(departureTime/100)) {
            const totalHours = 23 - Math.floor(arrivalTime/100) + Math.floor(departureTime/100)
            const totalMinutes = (departureTime%100) + (60 - arrivalTime%100)
            const totalHoursForPriceCalculation = totalHours + (totalMinutes/60)
            totalPrice = totalHoursForPriceCalculation * bookingLocationDetails!.price_per_hour
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
                    carId: userCar?._id,
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
                toast.success("user account created successfully")
                setIsLoading(false)  
                setshowGetDirection(true)
                
            } catch (error: any) {
                if (error.response) {
                    toast.error("There is an error while booking the parking space", error.response.data.status);
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
    <div className="flex justify-center items-center flex-col h-1vh bg-gray-700">
        <h1 className="text-white m-2 p-3 text-3xl ">{isLoading? "Processing" : "Book Space"}</h1>
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
                value={bookingDetails.departureTime}  
                onChange={(e) => setbookingDetails({...bookingDetails, departureTime: e.target.value})}
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
                
                <Button 
                type="button" 
                className="text-white bg-green-700 hover:bg-green-500"
                onClick={bookParkingSpace}>
                Book Parking Space
                </Button>

                {showGetDirection && (
                    <div>
                        <Button 
                        type="button" 
                        className="text-white bg-green-700 hover:bg-green-500"
                        onClick={getDirection}>
                        Get Direction
                        </Button>
                    </div>
                )}    

                <Link href={"/"}>Home</Link>


            </Field>
            </FieldGroup>
        </div> 
    </div>
    )
}

export default BookSpace