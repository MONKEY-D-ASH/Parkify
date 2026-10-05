import mongoose from "mongoose";

// In TypeScript, process.env.MONGO_URL has the type string | undefined because environment variables might not be set.
// The ! tells the compiler:
// 👉 “Trust me, this value is definitely not null or undefined at runtime.”
// So instead of forcing you to handle the undefined case, TypeScript treats it as a guaranteed string.

// The most important part is that this connect() method has to be available in almost every singles place in your app folder becasue without this you cannot talk to the database and with every single api call you have to have to establish this connection with the database right then most probably by storing the connectin in cache and reuse it with every api call
export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!) // this establish to connection between your project and mongoDB
        const connection = mongoose.connection; // assigning the connection to a variable for easier access 

        // if the connection is established successsfully then the mongoose runs emit("connected") as a broadcast and since connection.on() is a listener it listens to that specific broadcast and then tiggers this callback function 
        connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        })

        // when the connection is falied the mongoose grabs the error details from the mongoDB signal and packages it into a javascript object and emit("error", packagedJavascriptObject)
        connection.on("error", (error) => {
            console.log("MongoDB connection error. Please make sure MongoDB is running,. " , error);
            process.exit(); 
            // process.exit() is a built-in Node.js command that forces the entire backend application to stop running and shut down immediately.It is the code equivalent of opening your terminal and pressing Ctrl + C. as if the connection is not established successfully then we would not want to run our applicaton.
        })

    } catch (error) {
        console.log("Something went wrong!");
        console.log(error);
        
    }
}

