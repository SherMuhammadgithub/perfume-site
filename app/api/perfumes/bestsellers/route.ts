import { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongodb';
import Perfume from '../../../../models/Perfume';

// GET /api/perfumes/bestsellers - Get bestseller perfumes
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Parse query params for limit
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '6');

        const bestsellerPerfumes = await (Perfume as Model<any>)
            .find({ isBestseller: true })
            .sort({ averageRating: -1 })
            .limit(limit);

        return NextResponse.json(bestsellerPerfumes);
    } catch (error: any) {
        console.error('Error fetching bestseller perfumes:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch bestseller perfumes' },
            { status: 500 }
        );
    }
}