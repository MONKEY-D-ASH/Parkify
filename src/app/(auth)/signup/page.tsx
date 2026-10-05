"use client"

import { useAuthStore } from "@/store/Auth"
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

function SignupPage(){
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "customer",
        address: ""
    })

    const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // validate data
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !formData.phoneNumber || !formData.address) {
            toast.error("please fill out all the fields")
            return 
        }

        // call the store 
        if (formData.firstname.length !== 0 && formData.lastname.length !== 0 && formData.email.length !== 0 && formData.password.length !== 0 && formData.phoneNumber.length !== 0 && formData.address.length !== 0) {
            setIsLoading(true) // to show the user that we are processing and creating the account 
            const data = {
                username:`${formData.firstname} ${formData.lastname}`,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                role: formData.role,
                address: formData.address
            }
            try {
                const response = await axios.post("./api/signup", data)
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

    <div className="flex justify-center items-center flex-col h-lvh bg-gray-700">

        
        <h1 className="text-white m-2 p-3 text-3xl">{isLoading? "processing..." : "Sign Up"}</h1>
            <div className=" bg-black w-100 h-100 p-2 rounded-lg">
                    <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-firstname" className="text-white">First Name</FieldLabel>
                        <Input
                        className="text-white"
                        id="fieldgroup-firstname"
                        type="text"
                        placeholder="Enter your first name"
                        required
                        value={formData.firstname}
                        onChange={(e) => setFormData({...formData, firstname:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-lastname" className="text-white">Last Name</FieldLabel>
                        <Input
                        className="text-white"
                        id="fieldgroup-lastname"
                        type="text"
                        placeholder="Enter your lastname"
                        required
                        value={formData.lastname}
                        onChange={(e) => setFormData({...formData, lastname:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-email" className="text-white">Email</FieldLabel>
                        <Input
                        className="text-white"
                        id="fieldgroup-email"
                        type="email"
                        placeholder="Enter Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email:e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-password" className="text-white">Password</FieldLabel>
                        <Input
                        className="text-white"
                        id="fieldgroup-password"
                        type="password"
                        placeholder="Enter Password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password:e.target.value })}
                        />
                        <FieldDescription>password must be between 8-255 characters</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-phoneNumber" className="text-white">PhoneNo</FieldLabel>
                        <Input
                        className="text-white"
                        id="fieldgroup-phoneNumber"
                        type="text"
                        placeholder="Enter phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber:e.target.value })}
                        />
                        <FieldDescription>Phone Number must be valid and of 10 digits</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-role" className="text-white">Role</FieldLabel>
                        <Button
                        variant="outline"
                        className="text-white bg-green-700"
                        onClick={() => setFormData({...formData, role:"customer"})}
                        >Customer</Button>

                        <Button
                        variant="outline"
                        className="text-white bg-green-700"
                        onClick={() => setFormData({...formData, role:"provider"})}
                        >Provider</Button>
                        <FieldDescription>Select your role on this platform</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-address" className="text-white">Address</FieldLabel>
                        <Input
                        className="text-white"
                        id="fieldgroup-address"
                        type="text"
                        placeholder="Enter your current address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address:e.target.value })}
                        />
                    </Field>

                    <Field orientation="horizontal">
                        <Button 
                        type="reset" 
                        variant="outline" 
                        className="text-white"
                        onClick={() => setFormData({firstname: "", lastname: "", email: "", password: "", phoneNumber: "", role: "", address: ""})}
                        >Reset
                        </Button>

                        <Button 
                        type="submit" 
                        className="text-white bg-gray-500 hover:bg-gray-800"
                        onClick={handleSubmit}
                        >Submit
                        </Button>
                    </Field>    
                    </FieldGroup>
            </div> 
    </div>
    )
}

export default SignupPage