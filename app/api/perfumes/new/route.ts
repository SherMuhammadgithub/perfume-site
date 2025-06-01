import { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongodb';
import Perfume from '../../../../models/Perfume';

// GET /api/perfumes/new - Get new perfumes
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Parse query params for limit
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '6');

        const newPerfumes = await (Perfume as Model<any>)
            .find({ isNew: true })
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json(newPerfumes);
    } catch (error: any) {
        console.error('Error fetching new perfumes:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch new perfumes' },
            { status: 500 }
        );
    }
}