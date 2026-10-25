"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"


// this is the signup page where we will register the user and create an account for him for which we are using the createAccount() method in we defined in the useAuthStore react hook created using zustand
// in the handleSubmit function we are explicitly defining which type of event is gonna trigger this async function which is a reactFormEvent and that too of an HTMLFormElement and we are preventing the obvious default event which is to reload the web page dom structure

function RegistrationPage(){
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "",
        address: "",
        license: "",
        carModel: "",
        carColor: "",
        carType: ""
    })

    const handleUserRegistration = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // validate data
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !formData.phoneNumber || !formData.address) {
            toast.error("please fill out all the fields")
            return 
        }

        // call the store 
        if (formData.firstname.length !== 0 && formData.lastname.length !== 0 && formData.email.length !== 0 && formData.password.length !== 0 && formData.phoneNumber.length !== 0 && formData.address.length !== 0 && formData.license.length !== 0 && formData.carModel.length !== 0 && formData.carColor.length !== 0 && formData.carType.length !== 0) {
            setIsLoading(true) // to show the user that we are processing and creating the account 
            const data = {
                username:`${formData.firstname} ${formData.lastname}`,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                role: formData.role,
                address: formData.address,
                license: formData.license,
                carModel: formData.carModel,
                carColor: formData.carColor,
                carType: formData.carType
            }
            try {
                const response = await axios.post("./api/registerUser", data)
                console.log(response);
                toast.success("user account created successfully")
                setIsLoading(false) // to show the user that the account has been created successfully 
                router.push("/") // this will push the user to the home page
            } 
            catch (error: any) {    
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

        
        <h1 className="text-white m-2 p-3 text-3xl font-semibold tracking-tight drop-shadow-sm">{isLoading? "processing..." : "Registration"}</h1>
            <div className="bg-white w-full max-w-md p-8 rounded-2xl border border-[#E2E8F0] shadow-[0_8px_24px_rgba(30,58,138,0.25)]">
                    <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-firstname" className="text-[#0F172A] font-medium">First Name</FieldLabel>
                        <Input
                        className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                        id="fieldgroup-firstname"
                        type="text"
                        placeholder="Enter your first name"
                        required
                        value={formData.firstname}
                        onChange={(e) => setFormData({...formData, firstname:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-lastname" className="text-[#0F172A] font-medium">Last Name</FieldLabel>
                        <Input
                        className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                        id="fieldgroup-lastname"
                        type="text"
                        placeholder="Enter your lastname"
                        required
                        value={formData.lastname}
                        onChange={(e) => setFormData({...formData, lastname:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-email" className="text-[#0F172A] font-medium">Email</FieldLabel>
                        <Input
                        className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                        id="fieldgroup-email"
                        type="email"
                        placeholder="Enter Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-password" className="text-[#0F172A] font-medium">Password</FieldLabel>
                        <Input
                        className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                        id="fieldgroup-password"
                        type="password"
                        placeholder="Enter Password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password:e.target.value })}
                        />
                        <FieldDescription className="text-[#64748B] text-xs">password must be between 8-255 characters</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-phoneNumber" className="text-[#0F172A] font-medium">PhoneNo</FieldLabel>
                        <Input
                        className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                        id="fieldgroup-phoneNumber"
                        type="text"
                        placeholder="Enter phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber:e.target.value })}
                        />
                        <FieldDescription className="text-[#64748B] text-xs">Phone Number must be valid and of 10 digits</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-role" className="text-[#0F172A] font-medium">Role: <span className="text-[#0891B2] font-semibold capitalize">{formData.role}</span></FieldLabel>
                        <div className="flex flex-wrap gap-2">
                            <Button
                            id="fieldgroup-role"
                            variant="outline"
                            className={`flex-1 h-10 font-medium transition-all ${formData.role === "customer" ? "text-white border-transparent bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:text-white shadow-sm" : "text-[#1E3A8A] bg-white border-[#E2E8F0] hover:bg-[#ECFEFF] hover:border-[#0891B2]"}`}
                            onClick={() => setFormData({...formData, role:"customer"})}
                            >Customer</Button>

                            <Button
                            variant="outline"
                            id="fieldgroup-role"
                            className={`flex-1 h-10 font-medium transition-all ${formData.role === "provider" ? "text-white border-transparent bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:text-white shadow-sm" : "text-[#1E3A8A] bg-white border-[#E2E8F0] hover:bg-[#ECFEFF] hover:border-[#0891B2]"}`}
                            onClick={() => setFormData({...formData, role:"provider"})}
                            >Provider</Button>
                        </div>
                        <FieldDescription className="text-[#64748B] text-xs">Select your role on this platform</FieldDescription>
                    </Field>

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
                        <FieldLabel htmlFor="fieldgroup-license-plate" className="text-[#0F172A] font-medium">Vehicle License Plate</FieldLabel>
                        <Input
                        className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                        id="fieldgroup-license-plate"
                        type="text"
                        placeholder="Enter you license plate number"
                        required
                        value={formData.license}
                        onChange={(e) => setFormData({...formData, license:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-vehicle-model" className="text-[#0F172A] font-medium">Vehicle model</FieldLabel>
                        <Input
                        className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                        id="fieldgroup-vehicle-model"
                        type="text"
                        placeholder="Enter your vehicle model"
                        required
                        value={formData.carModel}
                        onChange={(e) => setFormData({...formData, carModel:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-vehicle-color" className="text-[#0F172A] font-medium">Vehicle color</FieldLabel>
                        <Input
                        className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                        id="fieldgroup-vehicle-color"
                        type="text"
                        placeholder="Enter your vehicle color"
                        required
                        value={formData.carColor}
                        onChange={(e) => setFormData({...formData, carColor:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-vehicle-type" className="text-[#0F172A] font-medium">Vehicle Type: <span className="text-[#0891B2] font-semibold capitalize">{formData.carType}</span></FieldLabel>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                            id="fieldgroup-vehicle-type"
                            variant="outline"
                            className={`h-10 font-medium transition-all ${formData.carType === "sedan" ? "text-white border-transparent bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:text-white shadow-sm" : "text-[#1E3A8A] bg-white border-[#E2E8F0] hover:bg-[#ECFEFF] hover:border-[#0891B2]"}`}
                            onClick={() => setFormData({...formData, carType:"sedan"})}
                            >sedan</Button>

                            <Button
                            variant="outline"
                            id="fieldgroup-vehicle-type"
                            className={`h-10 font-medium transition-all ${formData.carType === "suv" ? "text-white border-transparent bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:text-white shadow-sm" : "text-[#1E3A8A] bg-white border-[#E2E8F0] hover:bg-[#ECFEFF] hover:border-[#0891B2]"}`}
                            onClick={() => setFormData({...formData, carType:"suv"})}
                            >suv</Button>

                            <Button
                            variant="outline"
                            id="fieldgroup-vehicle-type"
                            className={`h-10 font-medium transition-all ${formData.carType === "hatchback" ? "text-white border-transparent bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:text-white shadow-sm" : "text-[#1E3A8A] bg-white border-[#E2E8F0] hover:bg-[#ECFEFF] hover:border-[#0891B2]"}`}
                            onClick={() => setFormData({...formData, carType:"hatchback"})}
                            >hatchback</Button>

                            <Button
                            variant="outline"
                            id="fieldgroup-vehicle-type"
                            className={`h-10 font-medium transition-all ${formData.carType === "luxury" ? "text-white border-transparent bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:text-white shadow-sm" : "text-[#1E3A8A] bg-white border-[#E2E8F0] hover:bg-[#ECFEFF] hover:border-[#0891B2]"}`}
                            onClick={() => setFormData({...formData, carType:"luxury"})}
                            >luxury</Button>
                        </div>
                    </Field>


                    <Field orientation="horizontal">
                        <Button 
                        type="submit" 
                        className="flex-1 h-11 text-white font-semibold bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95 shadow-md transition-all"
                        onClick={handleUserRegistration}
                        >Register User
                        </Button>
                    </Field>    
                    </FieldGroup>
            </div> 
    </div>
    )

}

export default RegistrationPage