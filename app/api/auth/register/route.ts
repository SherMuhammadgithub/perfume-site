import jwt from 'jsonwebtoken';
// import { Model } from 'mongoose';
import { Model } from 'mongoose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongodb';
import User from '../../../../models/User';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await (User as Model<any>).findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already in use' },
                { status: 400 }
            );
        }

        // Create new user
        const user = await (User as Model<any>).create({
            name,
            email,
            password,
            // Default role is 'user' as defined in the schema
        });

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
            message: 'Registration successful'
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}