import mongoose from "mongoose";

export async function connect(){
    try {
        console.log("trying to connet to the database");
        await mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection
        
        connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        })
        connection.on('error', (err) => {
            console.log("MongoDB connection error. Please make sure MongoDB is running" + err);
            process.exit()
        })
    } catch (error: any) {
        console.log("Something went wrong in the dbConfig.ts file");
        console.log(error);
    }
}
