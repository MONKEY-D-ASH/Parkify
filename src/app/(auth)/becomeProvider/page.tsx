"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"
import { useAuthStore } from "@/store/Auth"


// this is the signup page where we will register the user and create an account for him for which we are using the createAccount() method in we defined in the useAuthStore react hook created using zustand
// in the handleSubmit function we are explicitly defining which type of event is gonna trigger this async function which is a reactFormEvent and that too of an HTMLFormElement and we are preventing the obvious default event which is to reload the web page dom structure

function RegistrationPage(){
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const {setUserParkingSpace} = useAuthStore()
    const [isLoading, setIsLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        address: "",
        price_per_hour: "",
        availabilityStatus: true
    })

    const handleUserRegistration = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // validate data
        if (!formData.address || !formData.price_per_hour) {
            toast.error("please fill out all the fields")
            return 
        }

        // call the store 
        if (formData.address.length !== 0 && formData.price_per_hour.length !== 0) {
            setIsLoading(true) // to show the user that we are processing and creating the account 
            const data = {
                userId: user?._id,
                address: formData.address,
                price_per_hour: formData.price_per_hour,
                availabilityStatus: formData.availabilityStatus
            }
            try {
                const response = await axios.post("./api/becomeProvider", data)
                console.log(response.data.userSpace);
                setUserParkingSpace(response.data.userSpace)
                toast.success(response.data.message)
                setIsLoading(false) // to show the user that the account has been created successfully 
                router.push("/") // this will push the user to the home page
            } 
            catch (error: any) {   
                console.log(error);
                if (error.response) {
                    toast.error(error.response.data.error) // here we are forcefully extracting the error message from the response
                } else {
                    toast.error("Something went wrong")
                }
                setIsLoading(false)
            }
        }
    }

    return (
    <div className="flex justify-center items-center flex-col min-h-lvh px-4 py-8 bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)]">

        
        <h1 className="text-white m-2 p-3 text-3xl font-semibold tracking-tight drop-shadow-sm">{isLoading? "processing..." : "Register as a Provider"}</h1>
            <div className="bg-white w-full max-w-md p-8 rounded-2xl border border-[#E2E8F0] shadow-[0_8px_24px_rgba(30,58,138,0.25)]">
                    <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-address" className="text-[#0F172A] font-medium">Address</FieldLabel>
                        <Input
                        className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                        id="fieldgroup-address"
                        type="text"
                        placeholder="Enter your current address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-license-plate" className="text-[#0F172A] font-medium">Price Per Hour</FieldLabel>
                        <Input
                        className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                        id="fieldgroup-license-plate"
                        type="text"
                        placeholder="Enter Per Hour Rate for your parking space"
                        required
                        value={formData.price_per_hour}
                        onChange={(e) => setFormData({...formData, price_per_hour:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-availability-Status" className="text-[#0F172A] font-medium">Availability Status</FieldLabel>
                        <span className="text-[#0891B2] font-semibold capitalize">{formData.availabilityStatus? "Available" : "Not Available"}</span>
                        <Button
                        id="fieldgroup-vehicle-type"
                        variant="outline"
                        className="h-10 font-medium transition-all text-white border-transparent bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover: shadow-sm bg-white hover:bg-[#ECFEFF] hover:border-[#0891B2]"
                        onClick={() => setFormData({...formData, availabilityStatus:true})}
                        >Available</Button>

                        <Button
                        id="fieldgroup-vehicle-type"
                        variant="outline"
                        className="h-10 font-medium transition-all text-white border-transparent bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover: shadow-sm bg-white hover:bg-[#ECFEFF] hover:border-[#0891B2]"
                        onClick={() => setFormData({...formData, availabilityStatus:false})}
                        >Not Available</Button>
                    </Field>

                    <Field orientation="horizontal">
                        <Button 
                        type="submit" 
                        className="flex-1 h-11 text-white font-semibold bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95 shadow-md transition-all"
                        onClick={handleUserRegistration}
                        >Become Provider
                        </Button>
                    </Field>    
                    </FieldGroup>
            </div> 
    </div>
    )

}

export default RegistrationPage