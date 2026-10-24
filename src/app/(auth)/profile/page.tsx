"use client"

import React from "react";
import Link from "next/link";

function UserProfile(){
    
    return (
    <div className="flex justify-center items-center flex-col h-lvh bg-gray-700">
        <h1 className="text-white m-2 p-3 text-3xl ">User Profile</h1>
        <div className=" bg-black w-250 h-1vh p-5 mb-40 rounded-lg">
                <p className="text-white"> here display the details of the user by calling a profile route and then extracting all the necessary data of the user
                </p>
                <br />
                <Link href={"/"} className="text-white bg-blue-400 p-1 rounded-sm">Go to Home</Link>
        </div>
    </div>
    )
}

export default UserProfile