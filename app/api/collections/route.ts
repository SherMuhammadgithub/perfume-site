import { Model, SortOrder } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongodb';
import Collection from '../../../models/Collection';

// GET /api/collections - Get all collections
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Parse query parameters
        const { searchParams } = new URL(req.url);

        // Build query
        const query: Record<string, any> = {};

        // Filter by featured status
        const featured = searchParams.get('featured');
        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Filter by collection type (static/dynamic)
        const type = searchParams.get('type');
        if (type === 'static') {
            query.isStatic = true;
        } else if (type === 'dynamic') {
            query.isStatic = false;
        }

        // Sort order
        let sort: Record<string, SortOrder> = { displayOrder: 1 }; // Default: sort by displayOrder
        const sortOption = searchParams.get('sort');
        if (sortOption === 'newest') {
            sort = { createdAt: -1 };
        }

        // Execute query - fix TypeScript error with proper typing
        const collections = await (Collection as Model<any>).find(query).sort(sort);

        return NextResponse.json(collections);
    } catch (error: any) {
        console.error('Error fetching collections:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch collections' },
            { status: 500 }
        );
    }
}

// POST /api/collections - Create a new collection
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();

        // Check if collection with same name already exists
        const existingCollection = await (Collection as Model<any>).findOne({ name: body.name });
        if (existingCollection) {
            return NextResponse.json(
                { error: 'A collection with this name already exists' },
                { status: 400 }
            );
        }

        // Create new collection
        const collection = await (Collection as Model<any>).create(body);

        return NextResponse.json(collection, { status: 201 });
    } catch (error: any) {
        console.error('Error creating collection:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create collection' },
            { status: 400 }
        );
    }
}