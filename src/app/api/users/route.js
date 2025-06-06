import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/models/User";

// POST route doesn't require authentication
export async function POST(request) {
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
      !body.quizAttempts || // Changed from scores to quizAttempts
      !Array.isArray(body.quizAttempts) ||
      body.quizAttempts.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    let user = await User.findOne({ email: body.email });

    if (user) {
      // Ensure quizAttempts is an array
      if (!Array.isArray(user.quizAttempts)) {
        user.quizAttempts = [];
      }
      // Append the new quiz attempt to the existing user's attempts
      // body.quizAttempts from frontend is an array with the latest score object
      user.quizAttempts.push(body.quizAttempts[0]);
      // Update other user details if they can change
      user.name = body.name;
      user.age = body.age;
      user.gender = body.gender;
      user.contact = body.contact;
      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: "User data updated successfully with new quiz attempt",
          user: user, // Send back the updated user object
        },
        { status: 200 }
      );
    }

    // Create a new user with the first quiz attempt
    user = new User({
      name: body.name,
      age: body.age,
      gender: body.gender,
      email: body.email,
      contact: body.contact,
      quizAttempts: body.quizAttempts, // body.quizAttempts is already an array with one score object
    });

    // Save the user to the database
    await user.save();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "New user created with first quiz attempt",
        user: user,
      },
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
}

export async function GET(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Get URL search parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (email) {
      // Get specific user by email
      const user = await User.findOne({ email: email });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, user }, { status: 200 });
    } else {
      // Get all users
      const users = await User.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, users }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}
