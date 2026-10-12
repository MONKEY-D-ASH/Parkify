import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String,
        required: [true, "Please provide a valid Phone number"],
    },
    role:{
        type: String,
        enum: ["customer", "provider"],
        default: "customer"
    },
    address: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        default: "test"
    },
    forgotPasswordToken: {
        type: String,
        default: "test"
    },
    forgotPasswordTokenExpiry: {
        type: Date,
    },
    verifyToken: {
        type: String,
        default: "test"
    },
    verifyTokenExpiry: {
        type:Date
    },
})

// you can define your own methods that will be connected to the prototype of the schema and then you can access and use these methods just like you by "findById()" like methods on your schema 
// one such thing we would wanna do is encrypt the password before storing it in your database
// never use the arrow function while writing the prehook as you need context so using the traditional function we can now access the objects of the userScehma and perform operations on it and this function always takes a "next" parameter, because next is the way to pass on your request from one middleware to the next middleware or wherever it needs to go

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return; 
    this.password = await bcrypt.hash(this.password, 10)

    // try {
    // if(!this.isModified("password")) {
    //     return next()
    // } // we are exiting the function if the modified field is "NOT" the password field becasue if everytime we save something in the using the schema this encryption will happen everytime and we do not want that
    // this.password = await bcrypt.hash(this.password, 10) // assigning the password field with the given password after encryption
    // next()
    // }catch (error) {
    //         console.log("there is an error in password hashing in the userCollection pre hook", error.message);
    // }
})

// what this method do is, it will take the user's given password and the existing password in the database and match it
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// NOTE: HOW TO JWT TOKEN WORKS 

// the jwt token comprises of three parts the header (containing the algorithm to be used and the type of the token which is the jwt) , the payload (it is a JSON object containing the actual core data referred to as claims (standard and custom claims)), the signature ( it is the thing that the server compares to check if the token is valid or not)

// WORKING -
// the header and the payload and encoded using the algorithm , To generate the final part of the JWT (the Signature), the server takes the encoded header, adds a dot, adds the encoded payload, and passes that entire combination along with your Secret Key through the hashing algorithm specified in the header.
// When everything is assembled, the resulting string looks like this: hhhhhh.pppppp.ssssss.

// HOW THE SERVER DECODES THE TOKEN -
// The Server Decodes: The server splits the incoming token by the dots. It reads the header and payload to see who the user is.The Server Re-Calculates: Using its private Secret Key, the server independently runs the exact same formula again: hashing the received header and payload together.
// The Server Compares: It compares its newly calculated signature against the signature string sent by the client.
// If they match: The server knows the token is authentic and unchanged.
// If they do not match: If a user changes their role from "user" to "admin" in the payload, the server's calculated signature will completely mismatch the token's signature. The server will immediately catch the tampering and throw a 403 Forbidden error

userSchema.methods.generateAccessToken = function (){
    // short lived access token
    // jwt.sign method generates and digitally signs a compact JSON web Token string, it takes the payload as a js object and the secret or private key and some options like : expiresIn, algorithm etc in the form of an object     
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    )
}

userSchema.methods.generateRefreshToken = function (){
    // short lived access token
    // jwt.sign method generates and digitally signs a compact JSON web Token string, it takes the payload as a js object and the secret or private key and some options like : expiresIn, algorithm etc in the form of an object 
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    )
}

// NOTE: we DO NOT have to specify an "_id" or any other kind of specific primary key because whenever a document in generated the mongoDB automatically assigns a unique 12 byte BSON id under the key "_id" to each document 

// mongoose also act as a layer between mongoDB and you to validate the data as well

// it is convention to assign the name of the document as singular and with the first letter capital because in the mongoDB the collection of this document will be named as "users" (all in smallcaps and plural automatically) 

// we are assigning the name "User" to this database model and exporting it under the name "user"

// this mongoose.model creates a constructor named "User" using the Schema that we defined userSchema which contains special properties like the "type" and "required" along with it so when we make an instance using this constructor it has these built-in properties that it will check before assigning the value to it , this is the reason we create a userSchema instead of simply creating a constructor for this job as creating schema has other useful features like this. 

// we are making a database model that builds a "User" using the schema model userSchema like a constructor
// The mongoose.model() method compiles a Mongoose schema into an actionable Model, which acts as a constructor for documents and serves as the primary interface for interacting with a specific MongoDB collection

// NOTE :  we are defining all the methods in the prototype of the userSchema itself so as we export the userSchema the methods in its prototype are also accessible to us


// verifyToken is used to verify the user: it is a long gibberish string which is generated by api during the login of the user and one copy of this is sent and saved to the user's database document in mongodb and another copy is sent to the user or the browser. now this copy of the token in the browser is sent in your http request and the user is fetched from the mongoDB and then the copy of the verify token is matched with the one you got form the browser and if that matches, we will update the isVerified field of the user document as true, and the token generated will have a certain expiry and becasue of that the user/browser will have only a certain amount of time to get verified

// forgotPasswordToken : the copy is sent to the database and other to the user/browser/email and now the user will hit a route like forgotPassowrd or something and he will provide this token along with the new password to the api and the api will search in the database for the user document using this token and this will return you the user and the api will match the token and check the expiry and will allow the new password field to be set to the user document password  

// here if the model has already been created then we are choosing from the models array collection of the mongoose and if not then we are creating a brand new model called "User" using the schema "UserSchema" which will eventually be stored in the collection "users" 
// mongoose.models.User is a reference to a registered Mongoose model for a "users" collection. It is used to check if a model already exists to prevent overwrite errors, or to retrieve the existing model class to perform database operations without re-compiling the schema. so the first time it compiles the userschema to create the model but the next time it uses this already created model to initiate the document

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
// by exporting this model we are not only exporting the model but we will also be able to access the features of mongoDB