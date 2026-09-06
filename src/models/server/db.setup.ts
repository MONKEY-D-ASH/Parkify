import { db } from "../name";
import createUserCollection from "./user.collection";
import createCarCollection from "./car.collection";
import createParkingCollection from "./parking_space.collection";
import createBookingCollection from "./booking.collection";

import { databases } from "./config";

export default async function getOrCreateDB() {
    try {
        // if the database already exists then we will simple be able to access it otherwise we will create a new database
        await databases.get(db) // here databases is the object and .get() is a method which will make an http request to the appwrite server on the internet to "get" the db (main-questioncall which is the database Id) from my account (whose detail has already been inserted into the object during the object initialization in the config.ts file)        
        console.log("Database connection");
    } catch (error) {
        try {
            // creating a new database which will be called "db" and will have the databaseId imported from the name.ts file 
            await databases.create(db, "Main parking DB")
            console.log("Database created")
            // after the creation of the database we will call all these api's to create collections inside the database 
            await Promise.all([
                createUserCollection(),
                createCarCollection(),
                createParkingCollection(),
                createBookingCollection(),  
            ])
            console.log("Collections created successfully");
            console.log("Database connected")
        } catch (error) {
            console.log("Error creating databases or collection", error);
        }
    }
    return databases // this returning the object is optional and we can skip it, as it just adds convenience and modularity
}