import mongoose from "mongoose"

const carSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    license_plate: {
        type: String,
        unique: true
    },
    carModel: {
        type: String,
        required: [true, "Please provide the model of the car"],
    },
    carColor: {
        type: String,
        required: true,
    },
    carType: {
        type: String,
        enum: ["sedan", "suv", "hatchback", "luxury"],
        required: true,
    },
})


// here if the model has already been created then we are choosing from the models array collection of the mongoose and if not then we are creating a brand new model called "User" using the schema "UserSchema" which will eventually be stored in the collection "users" 
// mongoose.models.User is a reference to a registered Mongoose model for a "users" collection. It is used to check if a model already exists to prevent overwrite errors, or to retrieve the existing model class to perform database operations without re-compiling the schema. so the first time it compiles the userschema to create the model but the next time it uses this already created model to initiate the document

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export default Car;