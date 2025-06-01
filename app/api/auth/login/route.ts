import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongodb';
import User from '../../../../models/User';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Please provide email and password' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await (User as any).findOne({ email }).sort({});

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        // Set JWT as HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Return user data without password
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        return NextResponse.json({
            user: userData,
            message: 'Login successful'
        });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}