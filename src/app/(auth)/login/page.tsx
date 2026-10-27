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
import Link from "next/link";
import { useRouter } from "next/navigation";

function LoginUser(){
    const {setUserDetails, setUserCarDetails, setUserParkingSpace} = useAuthStore()
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
                if (response?.data?.userParkingSpace.length !== 0) {
                    setUserParkingSpace(response.data.userParkingSpace)
                }
                toast.success("login success") 
                router.push("/")
        }
        } catch (error: any) {
            console.log("there is an error in user login", error!.message);
            toast.error("login failed")
        }
        finally{
            setIsLoading(false)
        }        
    }

    return (
    <div className="flex justify-center items-center flex-col min-h-lvh px-4 bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)]">
        <h1 className="text-white m-2 p-3 text-3xl font-semibold tracking-tight drop-shadow-sm">{isLoading? "processing..." : "Login"}</h1>
        <div className="bg-white w-full max-w-md p-8 rounded-2xl border border-[#E2E8F0] shadow-[0_8px_24px_rgba(30,58,138,0.25)]">
            <FieldGroup>

            <Field>
                <FieldLabel htmlFor="fieldgroup-email" className="text-[#0F172A] font-medium">Email</FieldLabel>
                <Input
                className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                id="fieldgroup-email"
                type="email"
                placeholder="Enter Email"
                value={user.email}
                required
                onChange={(e) => setUser({...user, email:e.target.value})}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="fieldgroup-password" className="text-[#0F172A] font-medium">Password</FieldLabel>
                <Input
                className="h-11 bg-white text-[#0F172A] placeholder:text-[#64748B] border-[#E2E8F0] focus-visible:border-[#0891B2] focus-visible:ring-[#0891B2]/30"
                id="fieldgroup-password"
                type="password"
                placeholder="Enter Password"
                value={user.password}
                required
                onChange={(e) => setUser({...user, password:e.target.value})}
                />
            </Field>

            <Field orientation="horizontal">
                <Button type="submit" className="w-full h-11 text-white font-semibold bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95 shadow-md transition-all"
                onClick={handleLoginClick}
                >Login
                </Button>
            </Field>

            <div className="flex justify-center items-center gap-2 text-sm">
                <FieldLabel htmlFor="redirection-to-registerPage" className="text-[#64748B] font-normal w-auto">Don't have an Account?</FieldLabel>
                <Link className="text-[#0891B2] font-semibold hover:text-[#1E3A8A] hover:underline transition-colors" href={"/registerUser"}>Sign Up</Link>
            </div>

            </FieldGroup>
        </div> 
    </div>
    )

}

export default LoginUser