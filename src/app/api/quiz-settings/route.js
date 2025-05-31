import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import QuizSetting from "@/app/models/QuizSetting";
import { withAuth } from "../middleware"; // Assuming admin routes are protected

// GET route to fetch the current passcode (can be public or admin-only based on needs)
export async function GET(request) {
  try {
    await dbConnect();
    const setting = await QuizSetting.findOne({}); // Assuming only one setting document
    if (!setting) {
      // If no setting exists, you might want to return a default or indicate none is set
      return NextResponse.json({
        success: true,
        passcode: null,
        message: "No passcode set yet.",
      });
    }
    return NextResponse.json({ success: true, passcode: setting.passcode });
  } catch (error) {
    console.error("Error fetching quiz passcode:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching passcode",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST route to create or update the passcode (admin only)
// We'll wrap this with withAuth if it's intended for admin use only
const postHandler = async (request) => {
  try {
    await dbConnect();
    const body = await request.json();

    if (
      !body.passcode ||
      typeof body.passcode !== "string" ||
      body.passcode.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Passcode is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    // Find existing setting or create a new one
    let setting = await QuizSetting.findOne({});
    if (setting) {
      setting.passcode = body.passcode.trim();
    } else {
      setting = new QuizSetting({ passcode: body.passcode.trim() });
    }
    await setting.save();

    return NextResponse.json(
      {
        success: true,
        message: "Passcode updated successfully",
        passcode: setting.passcode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating quiz passcode:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating passcode",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

// Apply auth middleware if needed for POST. For now, assuming it's admin protected.
// If your `withAuth` middleware handles user roles, you can use it directly.
// Otherwise, you might need a specific admin check within the handler or a different middleware.
export const POST = withAuth(postHandler); // Or just `export const POST = postHandler;` if auth is handled differently or not needed here
