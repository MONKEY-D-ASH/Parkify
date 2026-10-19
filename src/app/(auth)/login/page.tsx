"use client"

import React from "react";
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/Auth";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function LoginUser(){
    const {setUserDetails, setUserCarDetails} = useAuthStore()
    const [user, setUser] = React.useState({
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = React.useState(false)
    const router = useRouter()

    // call the backend login route and then get the user details and the user's car details and then set them in the zustand store 
    const handleLoginClick = async(e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            if (user.email.length !== 0 && user.password.length !== 0) {
                setIsLoading(true)
                const response = await axios.post("./api/login", user)
                setUserDetails(response.data.user)
                setUserCarDetails(response.data.userCar)
                toast.success("login success") 
                router.push("/")
        }
        } catch (error: any) {
            console.log("there is an error in user login or getting current location", error!.message);
            toast.error("login failed")
        }
        finally{
            setIsLoading(false)
        }        
    }
    return (
    <div className="flex justify-center items-center flex-col h-lvh bg-gray-700">
        <h1 className="text-white m-2 p-3 text-3xl">{isLoading? "processing..." : "Login"}</h1>
        <div className=" bg-black w-100 h-100 p-2 rounded-lg">
            <FieldGroup>

            <Field>
                <FieldLabel htmlFor="fieldgroup-email" className="text-white">Email</FieldLabel>
                <Input
                className="text-white"
                id="fieldgroup-email"
                type="email"
                placeholder="Enter Email"
                value={user.email}
                required
                onChange={(e) => setUser({...user, email:e.target.value})}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="fieldgroup-password" className="text-white">Password</FieldLabel>
                <Input
                className="text-white"
                id="fieldgroup-password"
                type="password"
                placeholder="Enter Password"
                value={user.password}
                required
                onChange={(e) => setUser({...user, password:e.target.value})}
                />
            </Field>

            <Field orientation="horizontal">
                <Button 
                type="reset" 
                variant="outline" 
                className="text-white"
                onClick={() => setUser({email:"", password:""})}
                >Reset fields
                </Button>

                <Button type="submit" className="text-white bg-green-600 hover:bg-green-500"
                onClick={handleLoginClick}
                >Login
                </Button>
            </Field>
            
            </FieldGroup>
        </div> 
    </div>
    )
}

export default LoginUser