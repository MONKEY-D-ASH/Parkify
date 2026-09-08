// this page will be use to create dummy documents inside the parking space collection 
"use client"

import React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import axios from "axios"

function RegisterSpace(){
    const [spaceDetails, setSpaceDetails] = useState({
        name: "",
        state: "",
        price: 0,
        availability: false
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // this will make an api call to the backend where the api will register the details of the registration space in the database inside the parking space collection
        if (spaceDetails.name.length !== 0 && spaceDetails.price !== 0) {
            try {
                setIsLoading(true)
                const response = await axios.post("/api/space-registration", spaceDetails)
                console.log(response.data.message);
                
                
                setIsLoading(false)
            } catch (error: any) {
                console.log("there is an error while processing the registration", error?.message);
                console.log(error);
            }
        }
    }

    return (
    <div className="flex flex-col justify-center items-center h-lvh bg-gray-900">
        <h1 className="text-white m-2 p-3 text-3xl">{isLoading? "processing...": "Register Space"}</h1>
        <div className="bg-black w-100 h-100 p-2 rounded-lg">
            <FieldGroup>

            <Field>
                <FieldLabel htmlFor="fieldgroup-name" className="text-white">Place Name</FieldLabel>
                <Input 
                id="fieldgroup-name" 
                placeholder="Enter place" 
                className="text-white"
                value={spaceDetails.name} 
                required
                onChange={(e) => setSpaceDetails({...spaceDetails, name:e.target.value})}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="fieldgroup-name" className="text-white">State</FieldLabel>
                <Input 
                id="fieldgroup-name" 
                placeholder="Enter State" 
                className="text-white"
                value={spaceDetails.state} 
                required
                onChange={(e) => setSpaceDetails({...spaceDetails, state:e.target.value})}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="fieldgroup-email" className="text-white">price</FieldLabel>
                <Input
                id="fieldgroup-email"
                type="text"
                placeholder="Enter price"
                className="text-white"
                value={spaceDetails.price}
                required
                onChange={(e) => setSpaceDetails({...spaceDetails, price:Number(e.target.value)})}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="fieldgroup-email" className="text-white">Availability Status: {spaceDetails.availability? `Available✅` : `Not Available❌`}</FieldLabel>
                <Button
                type="button"
                onClick={(e) => setSpaceDetails({...spaceDetails, availability: true})}
                >Available
                </Button>

                <Button
                type="button"
                onClick={(e) => setSpaceDetails({...spaceDetails, availability: false})}
                >Not Available
                </Button>
            </Field>

            <Field orientation="horizontal">
                <Button 
                type="reset"
                variant="outline" 
                className="text-white"  
                onClick={() => setSpaceDetails({name:"", state: "", price:0, availability:false})}
                >
                Reset
                </Button>

                <Button 
                type="button" 
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

export default RegisterSpace