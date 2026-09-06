// this page will be use to create dummy documents inside the parking space collection 
"use client"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"

function RegisterSpace(){
    return (
    <div className="flex flex-col justify-center items-center h-lvh bg-gray-900">
        <h1 className="text-white m-2 p-3 text-3xl ">Register Space</h1>
        <div className="w-100 h-100 p-2">
            <FieldGroup>
            <Field>
                <FieldLabel htmlFor="fieldgroup-name" className="text-white">Name</FieldLabel>
                <Input id="fieldgroup-name" placeholder="Jordan Lee" className="" />
            </Field>
            <Field>
                <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                <Input
                id="fieldgroup-email"
                type="email"
                placeholder="name@example.com"
                />
                <FieldDescription>
                We&apos;ll send updates to this address.
                </FieldDescription>
            </Field>
            <Field orientation="horizontal">
                <Button type="reset" variant="outline">
                Reset
                </Button>
                <Button type="submit">Submit</Button>
            </Field>
            </FieldGroup>
        </div>    
    </div>
    )
}

export default RegisterSpace