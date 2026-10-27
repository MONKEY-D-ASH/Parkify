"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import axios from "axios";
import toast from "react-hot-toast";

interface BookingData {
  _id: string;
  address: string;
  price_per_hour: number;
  latitude: number;
  longitude: number;
  status: string;
  startTime: string; // ISO strings after JSON serialization
  endTime: string;
  totalPrice: number;
}

function UserProfile(){
    const currentLocation = useAuthStore((state) => state.currentLocation)
    const userCar = useAuthStore((state) => state.userCar)
    const user = useAuthStore((state) => state.user)    
    const userParkingSpace = useAuthStore((state) => state.userParkingSpace)    
    const [showBookingDetails, setShowBookingDetails ] = useState(false)
    const [activeBookingDetails, setActiveBookingDetails] = useState<BookingData[]>([])

    const updateBooking = async (id: string, action:string) => {
        const data = {
            userId: user?._id,
            bookingId : id,
            action: action
        }
        try {
            const response = await axios.post("./api/updateBooking", data)
            getActiveBookings()
            toast.success(response.data.message)
        } catch (error: any) {
            console.log("There is an error while updating User Bookings", error.response?.data?.message);
            toast.error("Booking Update Failed!")
        }
    }

    const getActiveBookings = async () => {
        try {
            const data = {
                userId: user?._id
            }
            const response = await axios.post("./api/activeBookings",data )
            console.log(response.data.responseData);
            setActiveBookingDetails(response.data.responseData)
            setShowBookingDetails(true)
        } catch (error: any) {
            console.log("There is an error while fetching User Bookings", error.response?.data?.message);
            toast.error("Active Booking fetching Failed!")
        }
    }

    const getDirection = (latitude: number, longitude: number) => {
            // redirecting the user to the google maps application to direct himself to the parking space
            window.location.href = `https://google.com/maps/dir/?api=1&origin=${currentLocation?.latitude},${currentLocation?.longitude}&destination=${latitude},${longitude}&travelmode=driving`
        }

    return (
    <div className="flex justify-center items-center flex-col min-h-lvh px-4 py-8 bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)]">
        <h1 className="text-white m-2 p-3 text-3xl font-semibold tracking-tight drop-shadow-sm">User Profile</h1>
        <div className="bg-white w-full max-w-3xl p-8 rounded-2xl border border-[#E2E8F0] shadow-[0_8px_24px_rgba(30,58,138,0.25)]">
                <FieldGroup>
                    <Field className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2.5"> Name: {user?.username}</FieldLabel>
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2.5"> Email: {user?.email}</FieldLabel>
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2.5"> Phone No: {user?.phoneNumber}</FieldLabel>
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2.5 capitalize"> Role: {user?.role}</FieldLabel>
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2.5 sm:col-span-2"> Address: {user?.address}</FieldLabel>
                    </Field>
                    <Field className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg px-3 py-2.5"> Car Model: {userCar?.carModel}</FieldLabel>
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg px-3 py-2.5 capitalize"> Car Type: {userCar?.carType}</FieldLabel>
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg px-3 py-2.5"> Car License: {userCar?.license}</FieldLabel>
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg px-3 py-2.5"> Car Color: {userCar?.carColor}</FieldLabel>
                    </Field>
                    <Field className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2.5"> Address: {userParkingSpace?.address}</FieldLabel>
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2.5"> Rate: ${userParkingSpace?.pricePerHour}</FieldLabel>
                        <FieldLabel className="text-[#0F172A] font-normal bg-[#ECFEFF] border border-[#CFFAFE] rounded-lg px-3 py-2.5"> Availability Status: {userParkingSpace?.availabilityStatus === true ? "Available" : "Not Available"}</FieldLabel>
                    </Field>
                    <Button 
                    type="button"
                    className="w-full h-11 text-white font-semibold bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95 shadow-md transition-all"
                    onClick={getActiveBookings}>
                    Get active Bookings
                    </Button>

                    {showBookingDetails && (
                        <div className="mt-2 space-y-4">
                            <div className="text-white font-semibold bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] rounded-lg px-3 py-2.5 shadow-sm">
                            Active Booking Details
                            </div>

                            {activeBookingDetails.length === 0 ? (
                            <div className="rounded-xl border border-[#CFFAFE] bg-[#ECFEFF] px-4 py-6 text-center text-sm text-[#64748B]">
                                You have no active bookings.
                            </div>
                            ) : (
                            activeBookingDetails.map((activeBooking) => (
                                <div
                                key={activeBooking._id}
                                className="overflow-hidden rounded-xl border border-[#DBEAFE] bg-white shadow-[0_4px_16px_rgba(30,58,138,0.12)]"
                                >
                                {/* Card header: address + status */}
                                <div className="flex items-center justify-between gap-3 bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-4 py-3">
                                    <p className="text-white font-semibold">{activeBooking.address}</p>
                                    <span className="shrink-0 rounded-full bg-[#ECFEFF] px-3 py-1 text-xs font-semibold capitalize text-[#10B981]">
                                    {activeBooking.status}
                                    </span>
                                </div>

                                {/* Card body */}
                                <div className="p-4 space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-2.5">
                                        <p className="text-xs uppercase tracking-wide text-[#64748B]">Rate</p>
                                        <p className="font-medium text-[#0F172A]">${activeBooking.price_per_hour}/hour</p>
                                    </div>
                                    <div className="rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-2.5">
                                        <p className="text-xs uppercase tracking-wide text-[#64748B]">Start</p>
                                        <p className="font-medium text-[#0F172A]">{activeBooking.startTime}</p>
                                    </div>
                                    <div className="rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-2.5">
                                        <p className="text-xs uppercase tracking-wide text-[#64748B]">End</p>
                                        <p className="font-medium text-[#0F172A]">{activeBooking.endTime}</p>
                                    </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border border-[#CFFAFE] bg-[#ECFEFF] px-4 py-3">
                                    <span className="text-sm font-medium text-[#64748B]">Total Price</span>
                                    <span className="text-lg font-semibold text-[#1E3A8A]">${activeBooking.totalPrice}</span>
                                    </div>

                                    <Field className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Button
                                        type="button"
                                        className="w-full h-11 text-white font-semibold bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95 shadow-md transition-all"
                                        onClick={() => updateBooking(activeBooking._id, "complete")}
                                    >
                                        Complete Booking
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-11 font-semibold text-[#1E3A8A] bg-white border-[#1E3A8A] hover:bg-[#EFF6FF] hover:text-[#1E3A8A] transition-all"
                                        onClick={() => updateBooking(activeBooking._id, "cancel")}
                                    >
                                        Cancel Booking
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-11 text-white font-semibold bg-[linear-gradient(135deg,#047857_0%,#10B981_100%)] hover:bg-[linear-gradient(135deg,#065F46_0%,#059669_100%)] hover:opacity-95 shadow-md transition-all"
                                        onClick={() => getDirection(activeBooking.latitude, activeBooking.longitude)}
                                    >
                                        Get Direction
                                    </Button>
                                    </Field>
                                </div>
                                </div>
                            ))
                            )}
                        </div>
                        )}
                </FieldGroup>

                <div className="mt-6 flex justify-center">
                    <Link href={"/"} className="text-center text-sm font-semibold text-[#0891B2] hover:text-[#1E3A8A] hover:underline transition-colors">Go to Home</Link>
                </div>
        </div>
    </div>
    )
}

export default UserProfile