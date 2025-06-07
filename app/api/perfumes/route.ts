import { v2 as cloudinary } from 'cloudinary';
import mongoose, { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../../lib/db/mongodb';
import Perfume from '../../../models/Perfume';

// Disable Next.js body parsing for this route
export const config = {
    api: {
        bodyParser: false,
    },
};

// Configure Cloudinary with debug logging
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Debug log to check if values are loaded
console.log('Cloudinary config check:', {
    cloud_name_exists: !!process.env.CLOUDINARY_CLOUD_NAME,
    api_key_exists: !!process.env.CLOUDINARY_API_KEY,
    api_secret_exists: !!process.env.CLOUDINARY_API_SECRET
});



// POST /api/perfumes - Create a new perfume with image upload
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Get form data directly from NextRequest
        const formData = await req.formData();

        // Extract text fields
        const perfumeData = {
            name: formData.get('name') as string,
            // Remove brand field
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string || '0'),
            discountPrice: formData.get('discountPrice') ?
                parseFloat(formData.get('discountPrice') as string) : undefined,
            volume: formData.get('volume') as string,
            stock: parseInt(formData.get('stock') as string || '0'),
            gender: formData.get('gender') as string,
            isNew: formData.get('isNew') === 'true',
            isBestseller: formData.get('isBestseller') === 'true',
            isFeatured: formData.get('isFeatured') === 'true',
        };

        // Extract collection IDs
        const collectionIds = formData.getAll('collections') as string[];
        if (collectionIds.length > 0) {
            (perfumeData as any).collections = collectionIds;
        } else {
            return NextResponse.json(
                { error: 'At least one collection is required' },
                { status: 400 }
            );
        }

        // Validate required fields (updated to remove brand)
        const requiredFields = ['name', 'description', 'price', 'volume', 'gender'] as const;
        type RequiredField = typeof requiredFields[number];
        for (const field of requiredFields) {
            if (!perfumeData[field as RequiredField]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Handle image uploads - FIX: Looking for image0, image1, etc. instead of 'images'
        const uploadedImages = [];

        // Look for up to 5 images with names image0, image1, etc.
        for (let i = 0; i < 5; i++) {
            const file = formData.get(`image${i}`) as File;
            if (!file || typeof file.size !== 'number' || file.size === 0) continue;

            // Convert File to buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload to Cloudinary directly
            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `perfumes/${perfumeData.name.toLowerCase().replace(/\s+/g, '-')}`,
                        resource_type: 'image',
                        public_id: `perfume-${uuidv4().substring(0, 8)}`,
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

            uploadedImages.push({
                url: result.secure_url,
                alt: perfumeData.name,
                isPrimary: i === 0,
                public_id: result.public_id
            });
        }

        // Add images to perfume data
        if (uploadedImages.length > 0) {
            (perfumeData as any).images = uploadedImages;
        } else {
            // Return error if no images were uploaded
            return NextResponse.json(
                { error: 'At least one image is required' },
                { status: 400 }
            );
        }

        // Create perfume in database
        const perfume = await (Perfume as Model<any>).create(perfumeData);

        return NextResponse.json(perfume, { status: 201 });
    } catch (error: any) {
        console.error('Error creating perfume:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create perfume' },
            { status: 400 }
        );
    }
}

// GET /api/perfumes - Get perfumes with filtering and pagination
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Parse URL to get query parameters
        const { searchParams } = new URL(req.url);

        // Build query
        const query: Record<string, any> = {};

        // Filter by collection IDs
        const collectionIds = searchParams.getAll('collection');
        if (collectionIds.length) {
            query.collections = { $in: collectionIds };
        }

        // Filter by brand through collection
        const brands = searchParams.getAll('brand');
        if (brands.length) {
            // Instead of directly filtering by brand, 
            // we'll find collections with these brands first
            const collectionsWithBrands = await mongoose.model('Collection').find({
                'filters.brands': { $in: brands }
            }).select('_id');

            const collectionIds = collectionsWithBrands.map(c => c._id);

            // If we already have collections filter, use $and to combine them
            if (query.collections) {
                query.$and = [
                    { collections: query.collections },
                    { collections: { $in: collectionIds } }
                ];
                delete query.collections;
            } else {
                query.collections = { $in: collectionIds };
            }
        }

        // Filter by gender
        const genders = searchParams.getAll('gender');
        if (genders.length) {
            query.gender = { $in: genders };
        }

        // Filter by price range
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter by featured/new/bestseller status
        const isFeatured = searchParams.get('featured');
        if (isFeatured === 'true') {
            query.isFeatured = true;
        }

        const isNew = searchParams.get('new');
        if (isNew === 'true') {
            query.isNew = true;
        }

        const isBestseller = searchParams.get('bestseller');
        if (isBestseller === 'true') {
            query.isBestseller = true;
        }

        // Search functionality
        const search = searchParams.get('q');
        if (search) {
            query.$text = { $search: search };
        }

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        // Sorting
        let sort: Record<string, 1 | -1> = {};
        const sortParam = searchParams.get('sort');

        switch (sortParam) {
            case 'price-asc':
                sort = { price: 1 };
                break;
            case 'price-desc':
                sort = { price: -1 };
                break;
            case 'rating':
                sort = { averageRating: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            default:
                sort = { createdAt: -1 }; // Default sort by newest
        }

        // Execute query with pagination and populate collections
        const perfumes = await (Perfume as Model<any>)
            .find(query)
            .populate({
                path: 'collections',
                select: 'name description image filters'
            })
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await (Perfume as Model<any>).countDocuments(query);

        return NextResponse.json({
            perfumes,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        console.error('Error fetching perfumes:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch perfumes' },
            { status: 500 }
        );
    }
}