import { NextResponse } from 'next/server';

export async function POST() {
    // Clear the auth cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('token', '', {
        expires: new Date(0), // Expire immediately
        path: '/',
    });
    return response;

    // The response is already returned above after setting the cookie
}