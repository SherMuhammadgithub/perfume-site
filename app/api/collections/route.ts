import { v2 as cloudinary } from 'cloudinary';
import { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../../lib/db/mongodb';
import Collection from '../../../models/Collection';

// Disable Next.js body parsing for this route
export const config = {
    api: {
        bodyParser: false,
    },
};

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// POST /api/collections - Create a new collection with image upload
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Get form data directly from NextRequest
        const formData = await req.formData();

        // Extract text fields
        const collectionData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            isFeatured: formData.get('isFeatured') === 'true',
            displayOrder: parseInt(formData.get('displayOrder') as string || '0'),
            isStatic: formData.get('isStatic') === 'true',
            filters: {
                brands: (formData.getAll('brands') || []) as string[],
                categories: (formData.getAll('categories') || []) as string[],
                genders: (formData.getAll('genders') || []) as string[],
                priceRange: {
                    min: parseFloat(formData.get('minPrice') as string || '0'),
                    max: parseFloat(formData.get('maxPrice') as string || '0'),
                }
            }
        };

        // Validate required fields
        if (!collectionData.name) {
            return NextResponse.json(
                { error: 'Collection name is required' },
                { status: 400 }
            );
        }

        // Check if collection with same name already exists
        const existingCollection = await (Collection as Model<any>).findOne({ name: collectionData.name });
        if (existingCollection) {
            return NextResponse.json(
                { error: 'A collection with this name already exists' },
                { status: 400 }
            );
        }

        // Handle image upload
        const imageFile = formData.get('image') as File;
        if (imageFile && typeof imageFile.size === 'number' && imageFile.size > 0) {
            // Convert File to buffer
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload to Cloudinary directly
            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `collections`,
                        resource_type: 'image',
                        public_id: `collection-${uuidv4().substring(0, 8)}`,
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                // Stream the buffer to Cloudinary
                const Readable = require('stream').Readable;
                const readableStream = new Readable();
                readableStream.push(buffer);
                readableStream.push(null);
                readableStream.pipe(uploadStream);
            });

            // Add image URL to collection data
            (collectionData as any).image = result.secure_url;
        }

        // Create collection in database
        const collection = await (Collection as Model<any>).create(collectionData);

        return NextResponse.json(collection, { status: 201 });
    } catch (error: any) {
        console.error('Error creating collection:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create collection' },
            { status: 400 }
        );
    }
}

// GET /api/collections - Get all collections
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Parse URL to get query parameters
        const { searchParams } = new URL(req.url);

        // Build query
        const query: Record<string, any> = {};

        // Filter by featured
        const featured = searchParams.get('featured');
        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Filter by static/dynamic
        const isStatic = searchParams.get('static');
        if (isStatic !== null) {
            query.isStatic = isStatic === 'true';
        }

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Sorting
        let sort: Record<string, 1 | -1> = { displayOrder: 1 }; // Default sort by display order

        // Execute query with pagination
        const collections = await (Collection as Model<any>)
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await (Collection as Model<any>).countDocuments(query);

        return NextResponse.json({
            collections,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        console.error('Error fetching collections:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch collections' },
            { status: 500 }
        );
    }
}