// databases.createStringAttribute(db, parkingSpaceCollection, "name", 50, true),
//         databases.createStringAttribute(db, parkingSpaceCollection, "ownerId", 50, true),
//         databases.createFloatAttribute(db, parkingSpaceCollection, "latitude", true),
//         databases.createFloatAttribute(db, parkingSpaceCollection, "longitude", true),
//         databases.createIntegerAttribute(db, parkingSpaceCollection, "price_per_hour", true, 1),
//         databases.createBooleanAttribute(db, parkingSpaceCollection, "availability_status", true),

import mongoose from "mongoose"

const parkingSpaceSchema = new mongoose.Schema({
    address: {
        type: String,
        required: [true, "Please provide a proper address of your parking space"]
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    pricePerHour: {
        type: Number,
        required: true,
    },
    availabilityStatus: {
        type: Boolean,
        deafault: true,
        required: true,
    },
})

// mongoose.models.User is a reference to a registered Mongoose model for a "users" collection. It is used to check if a model already exists to prevent overwrite errors, or to retrieve the existing model class to perform database operations without re-compiling the schema. so the first time it compiles the userschema to create the model but the next time it uses this already created model to initiate the document

const ParkingSpace = mongoose.models.ParkingSpace || mongoose.model("ParkingSpace", parkingSpaceSchema);

export default ParkingSpace;