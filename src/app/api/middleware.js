import { NextResponse } from 'next/server';

/**
 * Middleware to check if the request has a valid authentication token
 * @param {Request} request - The incoming request
 * @returns {NextResponse} - The response with the authentication status
 */
export function withAuth(handler) {
  return async (request) => {
    // For the auth endpoint itself, no token is required
    if (request.nextUrl.pathname === '/api/auth') {
      return handler(request);
    }

    // Get the token from the request headers
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    // If no token is provided, return unauthorized
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    // In a real application, you would validate the token against a database
    // For this simple example, we'll just check if a token exists
    // You could enhance this by storing valid tokens in a database or Redis
    
    // If token is valid, proceed with the request
    return handler(request);
  };
}
