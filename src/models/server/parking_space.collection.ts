import { Permission } from "node-appwrite";
import { databases } from "./config"
import { db, parkingSpaceCollection } from "../name"

export default async function createParkingCollection() {

    await databases.createCollection(db, parkingSpaceCollection, parkingSpaceCollection, [
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("user collection created successfully");

    await Promise.all([
        databases.createStringAttribute(db, parkingSpaceCollection, "spaceId", 50, true),
        databases.createStringAttribute(db, parkingSpaceCollection, "ownerId", 50, true),
        databases.createFloatAttribute(db, parkingSpaceCollection, "location_latitude", true),
        databases.createFloatAttribute(db, parkingSpaceCollection, "location_longitude", true),
        databases.createIntegerAttribute(db, parkingSpaceCollection, "price_per_hour", true, 1),
        databases.createBooleanAttribute(db, parkingSpaceCollection, "availability_status", true),
    ])
}