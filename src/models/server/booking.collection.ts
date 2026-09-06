import { Permission } from "node-appwrite";
import { databases } from "./config"
import { db, bookingCollection } from "../name"

export default async function createBookingCollection() {

    await databases.createCollection(db, bookingCollection, bookingCollection, [
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
    ])
    console.log("user collection created successfully");

    await Promise.all([
        databases.createStringAttribute(db, bookingCollection, "bookingId", 50, true),
        databases.createStringAttribute(db, bookingCollection, "userId", 50, true),
        databases.createStringAttribute(db, bookingCollection, "carId", 100, true),
        databases.createIntegerAttribute(db, bookingCollection, "spaceId", true, 1),
        databases.createBooleanAttribute(db, bookingCollection, "start_time", true),
        databases.createDatetimeAttribute(db, bookingCollection, "end_time", true),
        databases.createFloatAttribute(db, bookingCollection, "total_price", true),
        databases.createEnumAttribute(db, bookingCollection, "status",["active", "completed", "cancelled"], true),
    ])
}