import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { withAuth } from "../middleware";

export const POST = withAuth(async (request) => {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.age ||
      !body.gender ||
      !body.email ||
      !body.contact ||
      !body.scores
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: body.email });

    if (existingUser) {
      // Update the existing user's scores
      existingUser.scores = body.scores;
      existingUser.name = body.name;
      existingUser.age = body.age;
      existingUser.gender = body.gender;
      existingUser.contact = body.contact;
      await existingUser.save();

      return NextResponse.json(
        {
          success: true,
          message: "User data updated successfully",
          user: existingUser,
        },
        { status: 200 }
      );
    }

    // Create a new user
    const newUser = new User({
      name: body.name,
      age: body.age,
      gender: body.gender,
      email: body.email,
      contact: body.contact,
      scores: body.scores,
    });

    // Save the user to the database
    await newUser.save();

    // Return success response
    return NextResponse.json(
      { success: true, message: "User data saved successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error saving user data",
        error: error.message,
      },
      { status: 500 }
    );
  }
});

export const GET = withAuth(async () => {
  try {
    // Connect to the database
    await dbConnect();

    // Get all users
    const users = await User.find({}).sort({ createdAt: -1 });

    // Return success response
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
});
