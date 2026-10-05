import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    carId: {
        type: Schema.Types.ObjectId,
        ref: "Car"
    },
    spaceId: {
        type: Schema.Types.ObjectId,
        ref: "ParkingSpace"
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active",
    }
})

// mongoose.models.User is a reference to a registered Mongoose model for a "users" collection. It is used to check if a model already exists to prevent overwrite errors, or to retrieve the existing model class to perform database operations without re-compiling the schema. so the first time it compiles the userschema to create the model but the next time it uses this already created model to initiate the document

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;