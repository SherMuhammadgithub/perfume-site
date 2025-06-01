import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // Test the connection by getting account info
        const result = await cloudinary.api.ping();

        return NextResponse.json({
            success: true,
            message: "Cloudinary connection successful",
            result
        });
    } catch (error: any) {
        console.error('Cloudinary test error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            credentials: {
                cloud_name_exists: !!process.env.CLOUDINARY_CLOUD_NAME,
                api_key_exists: !!process.env.CLOUDINARY_API_KEY,
                api_secret_exists: !!process.env.CLOUDINARY_API_SECRET
            }
        }, { status: 500 });
    }
}