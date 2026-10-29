
import { connect } from "@/models/dbConfig";
import User from "@/models/user.collection";
import Car from "@/models/car.collection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Wait for MongoDB before performing database operations.
    await connect();

    const {
      username,
      email,
      password,
      phoneNumber,
      address,
      license,
      carModel,
      carColor,
      carType,
    } = await request.json();

    // Basic validation.
    if (
      !username ||
      !email ||
      !password ||
      !phoneNumber ||
      !address ||
      !license ||
      !carModel ||
      !carColor ||
      !carType
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Check whether the account already exists.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Check whether the license plate is already registered.
    const existingCar = await Car.findOne({ license });

    if (existingCar) {
      return NextResponse.json(
        { error: "This license plate is already registered." },
        { status: 409 }
      );
    }

    // Create the car.
    const newCar = new Car({
      license,
      carModel,
      carColor,
      carType,
    });

    const savedCar = await newCar.save();

    try {
      // The user model hashes the password in its save hook.
      const newUser = new User({
        username,
        email,
        password,
        phoneNumber,
        address,
        carId: savedCar._id,
      });

      await newUser.save();
    } catch (error) {
      // Avoid leaving an unlinked car if user creation fails.
      await Car.findByIdAndDelete(savedCar._id);
      throw error;
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Log the actual error in the server terminal, never the password.
    console.error("Registration API failed:", error);

    // Handle duplicate MongoDB keys.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "This email or license plate is already registered." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please check the server logs." },
      { status: 500 }
    );
  }
}
