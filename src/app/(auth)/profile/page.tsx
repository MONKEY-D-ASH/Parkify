"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import axios from "axios";
import toast from "react-hot-toast";

function UserProfile(){
    const userCar = useAuthStore((state) => state.userCar)
    const user = useAuthStore((state) => state.user)    
    const [activeBookingDetails, setActiveBookingDetails] = useState({
        address: "",
        price_per_hour: 0,
        status: "",
        startTime: "",
        endTime: "",
        totalPrice: 0
    })

    useEffect(() => {
        if (!user || !user._id) return
        const getActiveBookings = async () => {
            try {
                const data = {
                    userId: user._id
                }
                const response = await axios.post("./api/activeBookings",data )
                console.log(response.data);
                setActiveBookingDetails({
                    address: response.data.address,
                    price_per_hour: response.data.price_per_hour,
                    status: response.data.status,
                    startTime: response.data.startTime,
                    endTime: response.data.endTime,
                    totalPrice: response.data.totalPrice
                })
                toast.success("Details fetched successfully")
            } catch (error: any) {
                console.log("There is an error while fetching User Bookings", error.response.data.message);
                toast.error("Active Booking fetching Failed!")
            }
    }
        getActiveBookings()
    },[user?._id])

    return (
    <div className="flex justify-center items-center flex-col h-lvh bg-gray-700">
        <h1 className="text-white m-2 p-3 text-3xl ">User Profile</h1>
        <div className=" bg-black w-250 h-1vh p-5 mb-40 rounded-lg">
                <p className="text-white"> here display the details of the user by calling a profile route and then extracting all the necessary data of the user
                </p>
                <FieldGroup>
                    <Field>
                        <FieldLabel className="text-white"> Name: {user?.username}</FieldLabel>
                        <FieldLabel className="text-white"> Email: {user?.email}</FieldLabel>
                        <FieldLabel className="text-white"> Phone No: {user?.phoneNumber}</FieldLabel>
                        <FieldLabel className="text-white"> Role: {user?.role}</FieldLabel>
                        <FieldLabel className="text-white"> Address: {user?.address}</FieldLabel>
                    </Field>
                    <Field>
                        <FieldLabel className="text-white"> Car Model: {userCar?.carModel}</FieldLabel>
                        <FieldLabel className="text-white"> Car Type: {userCar?.carType}</FieldLabel>
                        <FieldLabel className="text-white"> Car License: {userCar?.license}</FieldLabel>
                        <FieldLabel className="text-white"> Car Color: {userCar?.carColor}</FieldLabel>
                    </Field>
                    <Field>
                        <FieldLabel className="text-white">Active Booking Details</FieldLabel>
                        <FieldLabel className="text-white">address: {activeBookingDetails.address}</FieldLabel>
                        <FieldLabel className="text-white">price_per_hour: {activeBookingDetails.price_per_hour}</FieldLabel>
                        <FieldLabel className="text-white">status: {activeBookingDetails.status}</FieldLabel>
                        <FieldLabel className="text-white">startTime: {activeBookingDetails.startTime}</FieldLabel>
                        <FieldLabel className="text-white">endTime: {activeBookingDetails.endTime}</FieldLabel>
                        <FieldLabel className="text-white">totalPrice: {activeBookingDetails.totalPrice}</FieldLabel>
                    </Field>
                </FieldGroup>

                <br />
                <Link href={"/"} className="text-white bg-blue-400 p-1 rounded-sm">Go to Home</Link>
        </div>
    </div>
    )
}

export default UserProfile