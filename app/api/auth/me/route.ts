import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongodb';
import User from '../../../../models/User';

interface JwtPayload {
    userId: string;
    role: string;
}

export async function GET(req: NextRequest) {
    try {
        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify token
        const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        await dbConnect();

        // Find user by ID
        const user = await (User as any).findById(userId, '-password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Return user data
        return NextResponse.json({ user });

    } catch (error: any) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { error: error.message || 'Authentication failed' },
            { status: 401 }
        );
    }
}