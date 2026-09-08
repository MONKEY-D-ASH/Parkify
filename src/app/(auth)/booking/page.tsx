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

function BookSpace(){
    return (
    <div className="flex justify-center items-center flex-col h-lvh bg-gray-700">
        <h1 className="text-white m-2 p-3 text-3xl ">Register Space</h1>
        <div className=" bg-black w-100 h-100 p-2 rounded-lg">
            <FieldGroup>

            <Field>
                <FieldLabel htmlFor="fieldgroup-name" className="text-white">Name</FieldLabel>
                <Input id="fieldgroup-name" placeholder="Jordan Lee" className="" />
            </Field>

            <Field>
                <FieldLabel htmlFor="fieldgroup-email" className="text-white">Email</FieldLabel>
                <Input
                id="fieldgroup-email"
                type="email"
                placeholder="name@example.com"
                />
            </Field>

            <Field orientation="horizontal">
                <Button type="reset" variant="outline" className="text-white">
                Reset
                </Button>
                <Button type="submit" className="text-white bg-gray-500 hover:bg-gray-800">Submit</Button>
            </Field>
            
            </FieldGroup>
        </div> 
    </div>
    )
}

export default BookSpace