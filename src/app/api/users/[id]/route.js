import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function GET(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the user ID from the URL
    const userId = params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { success: true, user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching user', error: error.message },
      { status: 500 }
    );
  }
}
