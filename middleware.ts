import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // Check if requesting admin path
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Simple check for token existence - don't verify here
        const token = request.cookies.get('token')?.value;

        // If no token, redirect to login
        if (!token) {
            return NextResponse.redirect(new URL('/login?redirect=/admin', request.url));
        }
    }

    // Continue for all paths
    return NextResponse.next();
}

// Match only admin paths
export const config = {
    matcher: '/admin/:path*',
};