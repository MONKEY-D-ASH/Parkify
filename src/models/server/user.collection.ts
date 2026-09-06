import { Permission } from "node-appwrite";
import { databases } from "./config"
import { db, userCollection } from "../name"

export default async function createUserCollection() {

    await databases.createCollection(db, userCollection, userCollection, [
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("user collection created successfully");

    await Promise.all([
        databases.createStringAttribute(db, userCollection, "userId", 50, true),
        databases.createStringAttribute(db, userCollection, "name", 50, true),
        databases.createStringAttribute(db, userCollection, "email", 50, true),
        databases.createStringAttribute(db, userCollection, "phone_number", 50, true),
        databases.createStringAttribute(db, userCollection, "password_hash", 50, true),
        databases.createEnumAttribute(db, userCollection, "role", ["driver", "provider"], true),
        databases.createStringAttribute(db, userCollection, "address", 100, true)   
    ])
    

}