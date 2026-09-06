import { Permission } from "node-appwrite";
import { databases } from "./config"
import { db, carCollection } from "../name"

export default async function createCarCollection() {

    await databases.createCollection(db, carCollection, carCollection, [
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("car collection created successfully");

    await Promise.all([
        databases.createStringAttribute(db, carCollection, "carId", 50, true),
        databases.createStringAttribute(db, carCollection, "userId", 50, true),
        databases.createStringAttribute(db, carCollection, "license_plate", 50, true),
        databases.createStringAttribute(db, carCollection, "car_model", 50, true),
        databases.createStringAttribute(db, carCollection, "car_color", 50, true),
        databases.createEnumAttribute(db, carCollection, "car_type", ["sedan", "suv", "hatchback", "luxury"], true),
    ])
}