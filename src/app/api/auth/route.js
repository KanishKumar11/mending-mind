import { NextResponse } from 'next/server';

// Store PIN in environment variable - fallback to the current PIN for development
const DASHBOARD_PIN = process.env.DASHBOARD_PIN || '9080';

export async function POST(request) {
  try {
    const { pin } = await request.json();
    
    // Simple validation
    if (!pin) {
      return NextResponse.json({ 
        success: false,
        message: 'PIN is required' 
      }, { status: 400 });
    }
    
    // Check if PIN matches
    if (pin === DASHBOARD_PIN) {
      // Create a session token
      const token = generateSessionToken();
      
      // In a real app, you would store this token in a database with an expiry
      // For simplicity, we'll just return it
      
      return NextResponse.json({ 
        success: true,
        token 
      });
    }
    
    // If PIN doesn't match, return error
    return NextResponse.json({ 
      success: false,
      message: 'Invalid PIN' 
    }, { status: 401 });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Authentication failed' 
    }, { status: 500 });
  }
}

// Helper function to generate a random session token
function generateSessionToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
